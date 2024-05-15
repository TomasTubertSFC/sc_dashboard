import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  GeoComponent,
  GeoComponentOption,
  DataZoomComponent,
} from 'echarts/components';
import { MapChart, MapSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { HttpClient } from '@angular/common/http';

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
  | GeoComponentOption
  | MapSeriesOption
>;

@Component({
  selector: 'app-catalunya-map',
  templateUrl: './catalunya-map.component.html',
  styleUrl: './catalunya-map.component.scss',
})
export class CatalunyaMapComponent implements OnInit, AfterViewInit {
  myChart!: echarts.ECharts;
  options: EChartsOption;
  http: HttpClient = inject(HttpClient);
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.myChart.resize();
  }

  ngOnInit(): void {
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      VisualMapComponent,
      GeoComponent,
      MapChart,
      CanvasRenderer,
      DataZoomComponent,
    ]);
  }

  ngAfterViewInit(): void {
    const catalunyaGeoJson =
      '../../../../../assets/shapefiles_catalunya_comarcas.geojson';

    const chartDom = document.getElementById('chart-container');
    this.myChart = echarts.init(chartDom);
    this.myChart.showLoading();
    this.http.get<any>(catalunyaGeoJson).subscribe((geoJson) => {
      this.myChart.hideLoading();
      echarts.registerMap('CATALUNYA', geoJson);
      this.options = {
        title: {
          text: 'Observacions per comarques',
          left: 'right',
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
        },
        dataZoom: [{ type: 'inside', disabled: true }],
        visualMap: {
          //Esto es el filtro que aparece abajo a la derecha
          left: 'right',
          min: 0,
          max: 10,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026',
            ],
          },
          text: ['Més observacions', 'Menys observacions'],
          calculable: true,
        },
        toolbox: {
          show: false,
        },
        series: [
          {
            name: 'Número de observacions',
            type: 'map',
            roam: false,
            map: 'CATALUNYA',
            emphasis: {
              label: {
                show: true,
              },
            },
            data: [
              { name: "Ribera d'Ebre", value: 0 },
              { name: 'Montsià', value: 0 },
              { name: 'Pallars Jussà', value: 0 },
              { name: 'Pallars Sobirà', value: 0 },
              { name: "Pla d'Urgell", value: 0 },
              { name: 'Anoia', value: 0 },
              { name: 'Bages', value: 0 },
              { name: 'Alt Urgell', value: 10 },
              { name: 'Alta Ribagorça', value: 0 },
              { name: 'Baix Camp', value: 0 },
              { name: 'Baix Ebre', value: 0 },
              { name: "Pla de l'Estany", value: 5 },
              { name: 'Priorat', value: 0 },
              { name: 'Vallès Occidental', value: 0 },
              { name: 'Vallès Oriental', value: 0 },
              { name: 'Osona', value: 0 },
              { name: 'Barcelonès', value: 10 },
              { name: 'Gironès', value: 0 },
              { name: 'Maresme', value: 0 },
              { name: 'Baix Llobregat', value: 0 },
              { name: 'Baix Empordà', value: 0 },
              { name: "Val d'Aran", value: 0 },
              { name: 'Urgell', value: 3 },
              { name: 'Cerdanya', value: 0 },
              { name: 'Berguedà', value: 0 },
              { name: 'Garraf', value: 0 },
              { name: 'Conca de Barberà', value: 0 },
              { name: 'Garrotxa', value: 0 },
              { name: 'Ripollès', value: 0 },
              { name: 'Noguera', value: 0 },
              { name: 'Terra Alta', value: 0 },
              { name: 'Solsonès', value: 0 },
              { name: 'Selva', value: 0 },
              { name: 'Segrià', value: 0 },
              { name: 'Garrigues', value: 0 },
              { name: 'Baix Penedès', value: 0 },
              { name: 'Alt Camp', value: 0 },
              { name: 'Alt Empordà', value: 0 },
              { name: 'Alt Penedès', value: 0 },
              { name: 'Segarra', value: 0 },
              { name: 'Tarragonès', value: 0 },
            ],
          },
        ],
      };
      this.myChart.setOption(this.options);
    });
    this.options && this.myChart.setOption(this.options);
  }
}
