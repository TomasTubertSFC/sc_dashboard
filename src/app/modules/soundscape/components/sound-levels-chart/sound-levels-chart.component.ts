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


  ngAfterViewInit(): void {
    let chartDom = document.getElementById('chart')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    option = {

      polar: {
        radius: [10, '80%']
      },
      radiusAxis: {
        max: 100,
        z: 90,
        lineStyle: {
          color: '#000'
        },
      },
      angleAxis: {
        type: 'category',
        data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        startAngle: 90
      },
      tooltip: {},
      series: {
        type: 'bar',
        data: [2, 1.2, 2.4, 3.6, this.observations.length],
        coordinateSystem: 'polar',
        barGap: '0%',
        barCategoryGap: '0%',
        itemStyle: {
          color: (params:any) => {
            const colors = ['#ff9999','#66b3ff','#99ff99','#ffcc99','#c2c2f0','#ffb3e6'];
            return colors[params.dataIndex % colors.length];
          }
        }
      },
      animation: false
    };
    option && myChart.setOption(option);
  }
}
