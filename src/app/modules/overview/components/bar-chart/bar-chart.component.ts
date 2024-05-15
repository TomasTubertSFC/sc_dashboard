import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { HttpClient } from '@angular/common/http';
import { ObservationsService } from '../../../../services/observations/observations.service';
import { Observations } from '../../../../models/observations';
import { lastValueFrom } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

interface ObservationsDataChart {
  date: string;
  observations: Observations[];
  count: number;
  month: number;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, AfterViewInit {
  myChart!: echarts.ECharts;
  options: EChartsOption;
  observations: ObservationsDataChart[] = [];
  today: Date = new Date();
  lastDay30: Date = new Date(new Date().setDate(this.today.getDate() - 30));

  observationService: ObservationsService = inject(ObservationsService);

  public filtersForm: FormGroup = new FormGroup({
    daysFilter: new FormControl([this.lastDay30, new Date()], []),
  });

  ngOnInit(): void {
    echarts.use([GridComponent, BarChart, CanvasRenderer]);
    this.filtersForm.valueChanges.subscribe(
      (values: { daysFilter: [Date, Date | null] }) => {
        console.log('values', values);
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
console.log('data[0]', data[0], new Date(data[0].attributes.created_at))
    const arrGroupObsByDays = data.reduce(
      (acc: { [key: string]: any[] }, observation, idx) => {
        // Add index signature to the type of acc
        const date = new Date(observation.attributes.created_at).toDateString();
        // console.log(date, idx);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(observation);
        return acc;
      },
      {}
    );

    const arrSorted = Object.entries(arrGroupObsByDays)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, observations]) => ({
        date: new Date(date).toLocaleDateString('ca-ES', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
        observations,
        count: observations.length,
        month: new Date(date).getMonth() + 1,
      }));

    this.observations = arrSorted;
    return arrSorted.filter((obs) => {
      const isBeforeToday = this.today >= new Date(obs.date);
      const isAfterLastDay30 = this.lastDay30 <= new Date(obs.date);
      console.log('obs.date', obs.date, new Date(obs.date));
      console.log('isBeforeToday', isAfterLastDay30);
      console.log('isAfterLastDay30', isBeforeToday);
      if (isBeforeToday && isAfterLastDay30) return true;
      return false;
    });
  }

  //Faltaría añadir el filtro por fechas que por defecto lo dejaría en los últimos 30 días.
  async ngAfterViewInit(): Promise<void> {
    const chartDom = document.getElementById('bar-chart-container');
    this.myChart = echarts.init(chartDom);
    this.myChart.showLoading();
    const obs = await this.getAllObservationsAndFormated();
    console.log(
      'obs.map((obs) => obs.date)',
      obs.map((obs) => obs.date)
    );
    this.options = {
      xAxis: {
        type: 'category',
        data: obs.map((obs) => obs.date),
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
