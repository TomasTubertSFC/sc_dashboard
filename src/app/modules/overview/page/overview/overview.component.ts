import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

var ROOT_PATH = 'https://echarts.apache.org/examples';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements AfterViewInit {
  @ViewChild('chart', { static: false }) chartContainer: ElementRef;

  ngAfterViewInit(): void {
    echarts.use([
      TooltipComponent,
      VisualMapComponent,
      GeoComponent,
      MapChart,
      CanvasRenderer,
    ]);

    var chartDom = document.getElementById('chart-container');
    
    console.log('chartDom', chartDom)
    console.log('this.chartContainer.nativeElement', this.chartContainer.nativeElement)
    //Y si añado el svg modificado y a cada uno de los paths le añado un id con el nombre de la comarca y la cantidad de 
    //observaciones?
   
    let svg =  'http://localhost:4200/assets/images/Beef_cuts_France.svg'
    // // console.log('svg', svg)
    // var myChart = echarts.init(this.chartContainer.nativeElement);
    // var option;
    // echarts.registerMap('Beef_cuts_France', {
    //   svg: svg,
    // } as { svg: any });

    // option = {
    //   tooltip: {},
    //   visualMap: {
    //     left: 'center',
    //     bottom: '10%',
    //     min: 5,
    //     max: 100,
    //     orient: 'horizontal',
    //     text: ['', 'Price'],
    //     realtime: true,
    //     calculable: true,
    //     inRange: {
    //       color: ['#dbac00', '#db6e00', '#cf0000'],
    //     },
    //   },
    //   series: [
    //     {
    //       name: 'French Beef Cuts',
    //       type: 'map',
    //       map: 'Beef_cuts_France',
    //       roam: true,
    //       emphasis: {
    //         label: {
    //           show: false,
    //         },
    //       },
    //       selectedMode: false,
    //       data: [
    //         { name: 'Queue', value: 15 },
    //         { name: 'Langue', value: 35 },
    //         { name: 'Plat de joue', value: 15 },
    //         { name: 'Gros bout de poitrine', value: 25 },
    //         { name: 'Jumeau à pot-au-feu', value: 45 },
    //         { name: 'Onglet', value: 85 },
    //         { name: 'Plat de tranche', value: 25 },
    //         { name: 'Araignée', value: 15 },
    //         { name: 'Gîte à la noix', value: 55 },
    //         { name: "Bavette d'aloyau", value: 25 },
    //         { name: 'Tende de tranche', value: 65 },
    //         { name: 'Rond de gîte', value: 45 },
    //         { name: 'Bavettede de flanchet', value: 85 },
    //         { name: 'Flanchet', value: 35 },
    //         { name: 'Hampe', value: 75 },
    //         { name: 'Plat de côtes', value: 65 },
    //         { name: 'Tendron Milieu de poitrine', value: 65 },
    //         { name: 'Macreuse à pot-au-feu', value: 85 },
    //         { name: 'Rumsteck', value: 75 },
    //         { name: 'Faux-filet', value: 65 },
    //         { name: 'Côtes Entrecôtes', value: 55 },
    //         { name: 'Basses côtes', value: 45 },
    //         { name: 'Collier', value: 85 },
    //         { name: 'Jumeau à biftek', value: 15 },
    //         { name: 'Paleron', value: 65 },
    //         { name: 'Macreuse à bifteck', value: 45 },
    //         { name: 'Gîte', value: 85 },
    //         { name: 'Aiguillette baronne', value: 65 },
    //         { name: 'Filet', value: 95 },
    //       ],
    //     },
    //   ],
    // };
    // myChart.setOption(option);

    // option && myChart.setOption(option);
  }
}
