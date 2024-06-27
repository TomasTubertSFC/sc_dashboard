import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
  private chart: echarts.ECharts;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.chart.resize();
  }
  @Input() observations: Observations[];
  private max: Number = 0;

  ngAfterViewInit(): void {
    let data = this.getDataFromObservations()
    let chartDom = document.getElementById('levelsChart')!;
    this.chart = echarts.init(chartDom);
    let option: EChartsOption;
    option = {
      legend: {
        data: ['< 35 dB(A)', '35 - 40 dB(A)', '40 - 45 dB(A)', '45 - 50 dB(A)', '50 - 55 dB(A)', '55 - 60 dB(A)', '60 - 65 dB(A)', '65 - 70 dB(A)', '70 - 75 dB(A)', '75 - 80 dB(A)', '> 80 dB(A)'],
      },
      polar: {
        radius: [10, '80%']
      },
      radiusAxis: {
        max: this.max.toFixed(2),
        z: 5,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333',
            width: 1.5,
            type: 'solid'
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#333',
            width: 1.5,
            type: 'solid'
          }
        },
        axisLabel: {
          show: true,
          formatter: '{value} dB(A)',
          textStyle: {
            color: '#333',
            fontSize: 12,
            //backgroundColor: '#FFF'
          },
        }

      },
      angleAxis: {
        type: 'category',
        //data: Array.from({length: 24}, (_, i) => `${i}:01 h - ${i == 23 ? 0 : i+1}:00 h`),
        data: Array.from({length: 24}, (_, i) => `${i}:00`),
        z: 6,
        startAngle: 90,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333',
            width: 2,
            type: 'solid'
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#333',
            width: 2,
            type: 'solid'
          }
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params:any) => {
          return `${params[0].value} dB(A)`;
        }
      },
      series: {
        type: 'bar',
        data: data.map((value) => {
          return {
            value: value,
            name: this.getLabel(Number(value)),
            itemStyle: {
              color: this.getColor(Number(value))
            }
          };
        }),
        coordinateSystem: 'polar',
        barGap: '0',
        barCategoryGap: '0',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
      },
      animation: true
    };
    this.chart.setOption(option);
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
  private getLabel(value: number): string{
    switch (true) {
      case value <= 35:
        return '< 35 dB(A)';
      case value > 35 && value <= 40:
        return '35 - 40 dB(A)';
      case value > 40 && value <= 45:
        return '40 - 45 dB(A)';
      case value > 45 && value <= 50:
        return '45 - 50 dB(A)';
      case value > 50 && value <= 55:
        return '50 - 55 dB(A)';
      case value > 55 && value <= 60:
        return '55 - 60 dB(A)';
      case value > 60 && value <= 65:
        return '60 - 65 dB(A)';
      case value > 65 && value <= 70:
        return '65 - 70 dB(A)';
      case value > 70 && value <= 75:
        return '70 - 75 dB(A)';
      case value > 75 && value <= 80:
        return '75 - 80 dB(A)';
      case value > 80:
        return '> 80 dB(A)';
      default:
        return 'Unknown';
    }

  }

}
