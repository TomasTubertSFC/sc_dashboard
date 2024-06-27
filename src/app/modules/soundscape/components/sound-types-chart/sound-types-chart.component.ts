import { AfterViewInit, Component, HostListener, Input } from '@angular/core';
import { Observations } from '../../../../models/observations';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent } from 'echarts/components';
import { __values } from 'tslib';
import { dataTool } from 'echarts';

echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer,PieChart]);

@Component({
  selector: 'app-sound-types-chart',
  templateUrl: './sound-types-chart.component.html',
  styleUrl: './sound-types-chart.component.scss'
})
export class SoundTypesChartComponent implements AfterViewInit{
  @Input() observations: Observations[];
  private chart: echarts.ECharts;
  private option! : echarts.EChartsCoreOption;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.chart.resize();
  }

  ngAfterViewInit(): void {
    let chartDom = document.getElementById('typesChart')!;
    this.chart = echarts.init(chartDom);

    const rawData:number[][] = this.getDataFromObservations().cuantity;
    let totalData:number = 0
    for (let i = 0; i < rawData[0].length; ++i) {
      for (let j:number = 0; j < rawData.length; ++j) {
        totalData += rawData[j][i];
      }
    }

    const grid = {
      left: 50,
      right: 50,
      top: 80,
      bottom: 10
    };

    const series = this.getDataFromObservations().types.map((name, sid) => {
      return {
        name,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        label: {
          show: true,
          formatter: (params:any) =>{
            console.log(params, totalData);
            return `${params.value} (${Math.round((params.value / totalData) * 1000) / 10}%)`;
          }
        },
        data: rawData[sid]
      };
    });

    this.option = {
      legend: {
        selectedMode: true
      },
      grid,
      yAxis: {
        type: 'value'
      },
      xAxis: {
        type: 'category',
        data: ['']
      },
      series
    };

    this.chart.setOption(this.option);
    
  }
  private getDataFromObservations(): {types : string[], cuantity: number[][]} {
    let types:string[] = [];
    let cuantity:number[] = [];
    this.observations.forEach(obs => {
      obs.relationships.types.forEach(type => {
        let index = types.indexOf(type.name);
        if(index === -1) {
          types.push(type.name);
          cuantity.push(1);
        } else {
          cuantity[index] += 1;
        }
      });
    });
    return {types: types, cuantity: cuantity.map(c => [c])};
  }
}
