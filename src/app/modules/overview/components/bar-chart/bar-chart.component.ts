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
import { Observations } from '../../../../models/observations';
import { lastValueFrom } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

interface ObservationsDataChart {
  date: Date;
  obs: Observations[];
  count: number;
}

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
  private lastDay30: Date = new Date(
    new Date().setDate(this.today.getDate() - 30)
  );
  private dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
            const isBeforeToday = obs.date <= values.daysFilter[1];
            const isAfterLastDay30 = obs.date >= values.daysFilter[0];
            if (isBeforeToday && isAfterLastDay30) return true;
            return false;
          });
          this.options = {
            xAxis: {
              type: 'category',
              data: this.obsFiltered.map((obs) =>
                obs.date.toLocaleDateString('ca-Es', this.dateOptions)
              ),
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: this.obsFiltered.map((obs) => obs.count),
                type: 'bar',
              },
            ],
          };
          this.options && this.myChart.setOption(this.options);
        }
      }
    );
  }

  async ngAfterViewInit(): Promise<void> {
    const chartDom = document.getElementById('bar-chart-container');
    this.myChart = echarts.init(chartDom);
    this.myChart.showLoading();
    this.observationService.getAllObservationsFormated().subscribe((data) => {
      this.observations = data;
      const arr30DaysBefore = data.filter((obs) => {
        const isBeforeToday = obs.date <= this.today;
        const isAfterLastDay30 = obs.date >= this.lastDay30;
        if (isBeforeToday && isAfterLastDay30) return true;
        return false;
      });
      // console.log('first', arr30DaysBefore.map((obs) =>
      //   obs.date.toLocaleDateString('ca-Es', dateOptions)
      // ))
      this.options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: function (params: any) {
            console.log('params', params);
            return params[0].data + ' ';
          },
        },
        xAxis: {
          type: 'category',
          data: arr30DaysBefore.map((obs) =>
            obs.date.toLocaleDateString('ca-Es', this.dateOptions)
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
