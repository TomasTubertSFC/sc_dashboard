import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Observation } from '../../../../models/observation';
import { OdourIntensity } from '../../../../models/odour-related-data';
import { PdfService } from '../../../../services/pdf/pdf.service';
import { UIChart } from 'primeng/chart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registers-typology-charts',
  templateUrl: './registers-typology-charts.component.html',
  styleUrl: './registers-typology-charts.component.scss',
})
export class RegistersTypologyChartsComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('typologyChart', { static: false }) typologyChart!: ElementRef;
  @ViewChild('doughnutChart', { static: false }) doughnutChart!: UIChart;
  @ViewChild('barChart', { static: false }) barChart!: UIChart;

  private studyZone$!: Subscription;

  private xLegend: string = 'Intensidad';
  private yLegend: string = 'Número de registros';

  public typeFilter: string = 'intensity';
  public doughnutData: any;
  public barData: any;
  public doughnutOptions: any;
  public barOptions: any;
  public observations: Observation[] = [];

  public chartDoughnut: boolean = true;

  private colors: { [filter: string]: { [key: number]: string } } = {
    ['type']: {
      [0]: '#000000',
      [1]: '#CBE87C',
      [2]: '#FFFF7D',
      [3]: '#D7B1F2',
      [4]: '#FF8133',
      [5]: '#8AD1F9',
      [6]: '#CCCCCC',
      [7]: '#FFFFFF',
    },
    ['intensity']: {
      [1]: '#eded74', //'#b0f4f3',
      [2]: '#e5e973', //'#97d5ec',
      [3]: '#dde572', //'#7eabe2',
      [4]: '#d4e071', //'#697cd8',
      [5]: '#c8da70', //'#5f53cf',
      [6]: '#bfd56f', //'#733fc5',
      [7]: '#B5CF6E', //'#8a2dba',
    },
    ['hedonicTone']: {
      [1]: '#ff6200', //'#b2301a',
      [2]: '#f5763e', //'#cb351d',
      [3]: '#f0805c', //'#f4723e',
      [4]: '#eb8a7b', //'#fdaf6d',
      [5]: '#e79190', //'#fcddae',
      [6]: '#e497a1', //'#73aea8',
      [7]: '#e19cb2', //'#008c99',
      [8]: '#dca6d1', //'#207793',
      [9]: '#d7b1f2', //'#001f50',
    },
  };

  constructor(
    private studyZoneService: StudyZoneService,
    private pdfService: PdfService
  ) {
    this.getChartsStilesAndOptions();
  }

  ngOnInit() {
    this.studyZone$ = this.studyZoneService.allObservations.subscribe((allObservations) => {
      this.observations = allObservations;

      this.getIntensityCharts();
    });
  }

  ngAfterViewInit(): void {
    const reportsElements = this.pdfService.reportsElements.getValue();

    this.pdfService.reportsElements.next({
      ...reportsElements,
      5: this.typologyChart,
    });
  }

  private getChartsStilesAndOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.doughnutOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.54,
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColorSecondary,
          },
        },
        tooltip: {
          callbacks: {
            label: function(context:any) {
                let label = context.dataset.label || '';

                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    let total = context.dataset.data.reduce((a:any, b:any) => a + b, 0);
                    label = ` ${Math.round((context.parsed * 100) / total)}%`;
                }
                return label;
            }
          }
        }
      },
    };
    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.54,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
          title: {
            display: true,
            text: this.yLegend,
            color: '#212529',
            font: {
              family: 'Space Grotesk',
              size: 15,
              weight: 'bold',
              lineHeight: 1,
            },
            padding: {top: 10, left: 0, right: 0, bottom: 10}
          }
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
          title: {
            display: true,
            text: this.xLegend,
            color: '#212529',
            font: {
              family: 'Space Grotesk',
              size: 15,
              weight: 'bold',
              lineHeight: 1,
            },
            padding: {top: 10, left: 0, right: 0, bottom: 10}
          }
        },
      },
    };
  }

  private getIntensityCharts() {

    this.xLegend = 'Intensidad';

    const intensities: (undefined | OdourIntensity)[] = this.observations.map(
      (observation) => observation.relationships.odourIntensity
    );

    //contador de valores de intensidad que devueve un array con los valores de intensidad
    const barData = Object.entries(
      intensities.reduce((acc: any, intensity) => {
        if (intensity === undefined) return acc;
        if (acc[intensity.id] === undefined) {
          acc[intensity.id] = { label: intensity.name, value: 0 };
        }
        acc[intensity.id].value++;
        return acc;
      }, {})
    ).sort((a: any, b: any) => b[1]['value'] - a[1]['value']);
    const barColors = barData.map(
      (data: any) => this.colors['intensity'][data[0]]
    );

    //obtenemos los 3 valores de intensadad mas altos, el resto los sumamos en otros
    const doughnutData = barData.slice(0, 3).map((data: any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3);
    doughnutData.push(barData.slice(3).reduce((acc: any, data: any) => acc + data[1]['value'], 0));
    doughnutColors.push('#CCCCCC');

    this.doughnutData = {
      labels: barData
        .map((data: any) => data[1]['label'])
        .slice(0, 3)
        .concat(['Otros']),
      datasets: [
        {
          data: doughnutData,
          backgroundColor: doughnutColors,
          hoverOffset: 5,
        },
      ],
    };
    this.barData = {
      labels: barData.map((data: any) => data[1]['label']),
      datasets: [
        {
          label: 'Observaciones',
          data: barData.map((data: any) => data[1]['value']),
          backgroundColor: barColors,
        },
      ],
    };
  }

  private getHedonicToneCharts() {

    this.xLegend = 'Tono hedónico';

    const hedonicTones = this.observations.map(
      (observation) => observation.relationships.odourHedonicTone
    );

    const barData = Object.entries(
      hedonicTones.reduce((acc: any, hedonicTone) => {
        if (hedonicTone === undefined) return acc;
        if (acc[hedonicTone.id] === undefined) {
          acc[hedonicTone.id] = { label: hedonicTone.name, value: 0 };
        }
        acc[hedonicTone.id].value++;
        return acc;
      }, {})
    ).sort((a: any, b: any) => b[1]['value'] - a[1]['value']);

    const barColors = barData.map(
      (data: any) => this.colors['hedonicTone'][data[0]]
    );

    const doughnutData = barData
      .slice(0, 3)
      .map((data: any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3);
    doughnutData.push(
      barData
        .slice(3)
        .reduce((acc: any, data: any) => acc + data[1]['value'], 0)
    );
    doughnutColors.push('#CCCCCC');

    this.doughnutData = {
      labels: barData
        .map((data: any) => data[1]['label'])
        .slice(0, 3)
        .concat(['Otros']),
      datasets: [
        {
          data: doughnutData,
          backgroundColor: doughnutColors,
          hoverOffset: 5,
        },
      ],
    };
    this.barData = {
      labels: barData.map((data: any) => data[1]['label']),
      datasets: [
        {
          label: 'Observaciones',
          data: barData.map((data: any) => data[1]['value']),
          backgroundColor: barColors,
        },
      ],
    };
  }

  private getTypeCharts() {

    this.xLegend = 'Tipología';

    const types = this.observations.map(
      (observation) =>
        observation.relationships.odourSubType.relationships?.odourType
    );

    const barData = Object.entries(
      types.reduce((acc: any, type) => {
        if (type === undefined) return acc;
        if (acc[type.id] === undefined) {
          acc[type.id] = { label: type.name, value: 0 };
        }
        acc[type.id].value++;
        return acc;
      }, {})
    ).sort((a: any, b: any) => b[1]['value'] - a[1]['value']);

    const barColors = barData.map((data: any) => this.colors['type'][data[0]]);

    const doughnutData = barData
      .slice(0, 3)
      .map((data: any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3);
    doughnutData.push(
      barData
        .slice(3)
        .reduce((acc: any, data: any) => acc + data[1]['value'], 0)
    );
    doughnutColors.push('#CCCCCC');

    this.doughnutData = {
      labels: barData
        .map((data: any) => data[1]['label'])
        .slice(0, 3)
        .concat(['Otros']),
      datasets: [
        {
          data: doughnutData,
          backgroundColor: doughnutColors,
          hoverOffset: 5,
        },
      ],
    };
    this.barData = {
      labels: barData.map((data: any) => data[1]['label']),
      datasets: [
        {
          label: 'Observaciones',
          data: barData.map((data: any) => data[1]['value']),
          backgroundColor: barColors,
        },
      ],
    };
  }

  private getSubtypeCharts() {

    this.xLegend = 'Subtipología';

    const subtypes = this.observations.map(
      (observation) => observation.relationships.odourSubType
    );

    const barData = Object.entries(
      subtypes.reduce((acc: any, subtype) => {
        if (subtype === undefined) return acc;
        if (acc[subtype.id] === undefined) {
          acc[subtype.id] = { label: subtype.name, value: 0 };
        }
        acc[subtype.id].value++;
        return acc;
      }, {})
    ).sort((a: any, b: any) => b[1]['value'] - a[1]['value']);

    const barColors = barData.map((data: any) => this.colors['type'][data[0]]);

    const doughnutData = barData
      .slice(0, 3)
      .map((data: any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3);
    doughnutData.push(
      barData
        .slice(3)
        .reduce((acc: any, data: any) => acc + data[1]['value'], 0)
    );
    doughnutColors.push('#CCCCCC');

    this.doughnutData = {
      labels: barData
        .map((data: any) => data[1]['label'])
        .slice(0, 3)
        .concat(['Otros']),
      datasets: [
        {
          data: doughnutData,
          backgroundColor: doughnutColors,
          hoverOffset: 5,
        },
      ],
    };
    this.barData = {
      labels: barData.map((data: any) => data[1]['label']),
      datasets: [
        {
          label: 'Observaciones',
          data: barData.map((data: any) => data[1]['value']),
          backgroundColor: barColors,
        },
      ],
    };
  }

  public changeTypeFilter(): void {

    if (this.typeFilter === 'intensity') this.getIntensityCharts();
    else if (this.typeFilter === 'hedonicTone') this.getHedonicToneCharts();
    else if (this.typeFilter === 'type') this.getTypeCharts();
    else this.getSubtypeCharts();

    if(this.barChart) this.barChart.refresh();
    if(this.doughnutChart)  this.doughnutChart.refresh();

    this.getChartsStilesAndOptions();

  }

  ngOnDestroy() {
    this.studyZone$.unsubscribe();
  }

}
