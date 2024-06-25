import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observations } from '../../../../models/observations';

import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

@Component({
  selector: 'app-observation-info-modal',
  templateUrl: './observation-info-modal.component.html',
  styleUrl: './observation-info-modal.component.scss',
})
export class ObservationInfoModalComponent implements OnInit, OnChanges {
  @Input() observationSelected!: Observations;
  @Input() isOpen: boolean = false;
  @Output() hideModal: EventEmitter<void> = new EventEmitter<void>();

  private myChart!: echarts.ECharts;
  private options: EChartsOption;
  private loadingOptions = {
    text: 'Carregant...',
    color: '#FF7A1F',
  };

  closeModal(): void {
    this.hideModal.emit();
  }
  ngOnInit(): void {
    echarts.use([
      GridComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition,
    ]);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      setTimeout(() => {
        // Access the CSS variable --blue-light
        const rootStyle = getComputedStyle(document.documentElement);
        const blueLightColor = rootStyle
          .getPropertyValue('--blue-light')
          .trim();
        const chartDom = document.getElementById('line-chart-container');
        this.myChart = echarts.init(chartDom);
        this.myChart.showLoading('default', this.loadingOptions);
        const LAeqT = this.observationSelected.attributes.LAeqT.split(',').map(
          (value) => Number(value)
        );
        const seconds = [...Array(LAeqT.length)].map((_, i) => i + 1);
        this.options = {
          xAxis: {
            type: 'category',
            data: seconds,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: LAeqT,
              type: 'line',
              itemStyle: {
                color: blueLightColor,
              },
              lineStyle: {
                color: blueLightColor,
              },
            },
          ],
        };
        this.myChart.hideLoading();
        this.options && this.myChart.setOption(this.options);
      }, 100);
    }
  }
}
