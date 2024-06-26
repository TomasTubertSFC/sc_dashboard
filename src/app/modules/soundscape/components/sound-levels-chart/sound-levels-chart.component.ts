import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observations } from '../../../../models/observations';
import { PolarComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';


type EChartsOption = echarts.EChartsCoreOption;
echarts.use([
  TitleComponent,
  PolarComponent,
  TooltipComponent,
  BarChart,
  CanvasRenderer
]);

@Component({
  selector: 'app-sound-levels-chart',
  templateUrl: './sound-levels-chart.component.html',
  styleUrl: './sound-levels-chart.component.scss'
})
export class SoundLevelsChartComponent implements AfterViewInit{
  @Input() observations: Observations[];
  private max: Number = 0;

  ngAfterViewInit(): void {
    let data = this.getDataFromObservations()
    let chartDom = document.getElementById('chart')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    option = {

      polar: {
        radius: [10, '80%']
      },
      radiusAxis: {
        max: this.max.toFixed(2),
        z: 90,
        lineStyle: {
          color: '#000'
        },
      },
      angleAxis: {
        type: 'category',
        data: Array.from({length: 24}, (_, i) => `${i}:00 h.`),
        startAngle: 90
      },
      tooltip: {},
      series: {
        type: 'bar',
        data: data,
        coordinateSystem: 'polar',
        barGap: '0%',
        barCategoryGap: '0%',
        itemStyle: {
          color: (params:any) => {
            return this.getColor(params.value);
          }
        }
      },
      animation: false
    };
    option && myChart.setOption(option);
  }

  private getDataFromObservations(): Number[] {
    let data: Number[][] = Array.from({length: 24}, () => []);
    let max = 0;
    this.observations.forEach(observation => {
      let hour = new Date(observation.attributes.created_at).getHours();
      if(!data[hour]) data[hour] = [];
      if(Number(observation.attributes.Leq)) {
        data[hour].push(Number(observation.attributes.Leq));
      }
    });
    
    const result = data.map(hourData => {
      if(hourData.length === 0) return 0;
      let sum = hourData.reduce((a, b) => Number(a) + Number(b));
      let avg = Number(sum)/hourData.length;
      this.max = Math.max(Number(this.max), Number(avg));
      return  Number((avg).toFixed(2));
    });
    return result; 
  }

  private getColor(value: number): string{
    switch (true) {
      case value <= 35:
        return '#B7CE8E';
      case value > 35 && value <= 40:
        return '#1D8435';
      case value > 40 && value <= 45:
        return '#0E4C3C';
      case value > 45 && value <= 50:
        return '#ECD721';
      case value > 50 && value <= 55:
        return '#9F6F2C';
      case value > 55 && value <= 60:
        return '#EF7926';
      case value > 60 && value <= 65:
        return '#C71932';
      case value > 65 && value <= 70:
        return '#8D1A27';
      case value > 70 && value <= 75:
        return '#88497B';
      case value > 75 && value <= 80:
        return '#18558C';
      case value > 80:
        return '#134367';
      default:
        return '#333';
    }
  }

}