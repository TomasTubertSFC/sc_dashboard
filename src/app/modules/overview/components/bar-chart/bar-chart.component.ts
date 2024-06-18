import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { ObservationsService } from '../../../../services/observations/observations.service';
import { Observations, ObservationsDataChart } from '../../../../models/observations';
import { FormControl, FormGroup } from '@angular/forms';

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, AfterViewInit {
  private myChart!: echarts.ECharts;
  private options: EChartsOption;
  private observations: ObservationsDataChart[] = [];
  private obsFiltered: ObservationsDataChart[] = [];
  public today: Date = new Date();
  public timeFilterSelected!: string;
  private lastDay30: Date = new Date(
    new Date().setDate(this.today.getDate() - 30)
  );
  private dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  private loadingOptions = {
    text: 'Carregant...',
    color: '#FF7A1F',
  };

  private observationService: ObservationsService = inject(ObservationsService);

  public filtersForm: FormGroup = new FormGroup({
    daysFilter: new FormControl([this.lastDay30, new Date()], []),
  });

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.myChart.resize();
  }

  ngOnInit(): void {
    echarts.use([GridComponent, BarChart, CanvasRenderer]);
    this.filtersForm.valueChanges.subscribe(
      (values: { daysFilter: [Date, Date | null] }) => {
        const haveTwoDaysSelected = values.daysFilter[1] !== null;
        if (haveTwoDaysSelected) {
          this.obsFiltered = this.observations.filter((obs) => {
            const isBeforeToday = new Date (obs.date) <= values.daysFilter[1];
            const isAfterLastDay30 = new Date(obs.date) >= values.daysFilter[0];
            if (isBeforeToday && isAfterLastDay30) return true;
            return false;
          });
          this.updateChart(this.obsFiltered);
          this.timeFilterSelected = null
        }
      }
    );
  }

 private updateChart(observations: ObservationsDataChart[]) {
    this.options = {
      xAxis: {
        type: 'category',
        data: observations.map((obs) =>
          obs.date
        ),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: observations.map((obs) => obs.count),
          type: 'bar',
        },
      ],
    };
    this.options && this.myChart.setOption(this.options);
  }

  private currentWeek(date:Date){
    let yearStart = new Date(date.getFullYear(), 0, 1);
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let dayOfYear = ((today.valueOf() - yearStart.valueOf() + 1) / 86400000);
    return Math.ceil(dayOfYear / 7)
  }

  weekFilter() {
    const groupByWeek = this.obsFiltered.reduce((acc: {[key: number]: any[]},obs) => {
      const day = obs.completeDay
      const week = this.currentWeek(day)
      if(!acc[week]){
        acc[week] = [obs]
      }
      acc[week].push(obs)
      return acc;
    }, {})
    const filteredObsByWeeks = Object.values(groupByWeek).map((weekObs) => {
      return {
        date: weekObs[0].date,
        obs: weekObs,
        count: weekObs.length,
        completeDay: weekObs[0].completeDay
      }
    })
    this.obsFiltered = filteredObsByWeeks;
    this.updateChart(this.obsFiltered)
    this.timeFilterSelected = 'week'
  }

  async ngAfterViewInit(): Promise<void> {
    const chartDom = document.getElementById('bar-chart-container');
    this.myChart = echarts.init(chartDom);
    this.myChart.showLoading('default', this.loadingOptions);
    this.observationService.getAllObservationsFormated().subscribe((data) => {
      this.observations = data;
      console.log('this.observations', this.observations)
      const arr30DaysBefore = data.filter((obs) => {
        const isBeforeToday = new Date(obs.date) <= this.today;
        const isAfterLastDay30 = new Date(obs.date) >= this.lastDay30;
        if (isBeforeToday && isAfterLastDay30) return true;
        return false;
      });
      console.log(arr30DaysBefore)
      this.obsFiltered = arr30DaysBefore;

      this.options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          formatter: function (params: any) {
            return params[0].data + ' ';
          },
        },
        xAxis: {
          type: 'category',
          data: arr30DaysBefore.map((obs) =>
            obs.date
          ),
          axisLabel: {
            interval: 0, // This forces displaying all labels
            rotate: 45, // Optional: you can rotate labels to prevent overlapping
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: arr30DaysBefore.map((obs) => obs.count),
            type: 'bar',
          },
        ],
      };
      this.myChart.hideLoading();

      this.options && this.myChart.setOption(this.options);
    });
  }
}
