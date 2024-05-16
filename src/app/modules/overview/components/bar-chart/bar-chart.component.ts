import { AfterViewInit, Component, HostListener, OnInit, inject } from '@angular/core';
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
  private lastDay30: Date = new Date(new Date().setDate(this.today.getDate() - 30));

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
              data: this.obsFiltered.map((obs) => obs.date.toDateString()),
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

  private async getAllObservationsAndFormated(): Promise<
    ObservationsDataChart[]
  > {
    const response = await lastValueFrom(
      this.observationService.getAllObservations()
    );
    const data = response.data;

    const arrGroupObsByDays = data.reduce(
      (
        acc: {
          [key: string]: { date: Date; obs: Observations[]; count: number };
        },
        observation,
        idx
      ) => {
        const splitedDate = observation.attributes.created_at
          .split(' ')[0]
          .split('-');
        const formatedDate = new Date(
          Number(splitedDate[0]),
          Number(splitedDate[1]) - 1,
          Number(splitedDate[2])
        );
        // console.log('formatedDate', formatedDate);
        const key = formatedDate.toDateString(); // Convert the date to a string for use as the index
        if (!acc[key]) {
          acc[key] = { date: formatedDate, obs: [], count: 0 };
        }
        acc[key].obs.push(observation);
        return acc;
      },
      {}
    );

    const arrSorted = Object.values(arrGroupObsByDays)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((obs) => ({
        ...obs,
        count: obs.obs.length,
      }));

    this.observations = arrSorted;
    const arr30DaysBefore = arrSorted.filter((obs) => {
      const isBeforeToday = obs.date <= this.today;
      const isAfterLastDay30 = obs.date >= this.lastDay30;
      if (isBeforeToday && isAfterLastDay30) return true;
      return false;
    });
    return arr30DaysBefore;
  }

  //Faltaría añadir el filtro por fechas que por defecto lo dejaría en los últimos 30 días.
  async ngAfterViewInit(): Promise<void> {
    const chartDom = document.getElementById('bar-chart-container');
    this.myChart = echarts.init(chartDom);
    this.myChart.showLoading();
    const obs = await this.getAllObservationsAndFormated();
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params:any) {
          console.log('params', params)
          return params[0].data +' ';
        }
      },
      xAxis: {
        type: 'category',
        data: obs.map((obs) =>
          obs.date.toLocaleDateString('ca-Es', dateOptions)
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
          data: obs.map((obs) => obs.count),
          type: 'bar',
        },
      ],
    };
    this.myChart.hideLoading();

    this.options && this.myChart.setOption(this.options);
  }
}
