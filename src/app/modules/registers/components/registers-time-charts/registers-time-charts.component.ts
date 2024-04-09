import { Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Observation } from '../../../../models/observation';
import { PdfService } from '../../../../services/pdf/pdf.service';
import { OdourHedonicTone, OdourIntensity, OdourTypeData } from '../../../../models/odour-related-data';
import { UIChart } from 'primeng/chart';

interface dataset {
  type: string;
  label: string; //name of observation
  backgroundColor: string; //color of observation
  data: number[]; //number of observations of each month and type
}

@Component({
  selector: 'app-registers-time-charts',
  templateUrl: './registers-time-charts.component.html',
  styleUrl: './registers-time-charts.component.scss',
})
export class RegistersTimeChartsComponent implements OnInit, OnDestroy {
  @ViewChild('registerTimeChart', { static: false }) registerTimeChart!: ElementRef;
  @ViewChild('chart', {static: false}) chart!: UIChart;

  public timeFilter: string = 'months';
  public dataTypeFilter: string = 'type';

  public data: {
    labels: string[];
    datasets: dataset[];
  } | null = null;

  public options: any;

  public observations: Observation[] = [];

  private types: (OdourTypeData | undefined)[] = [];
  private intensities: (OdourIntensity | undefined)[] = [];
  private hedonicTones: (OdourHedonicTone | undefined)[] = [];
  private firstYear: number = new Date().getFullYear();
  private lastYear: number = 0;

  private xLegend: string = 'Fecha del registro de olor';
  private yLegend: string = 'Número de registros por mes';

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

  constructor(private studyZoneService: StudyZoneService, private pdfService:PdfService) {}

  ngOnInit() {
    this.getChartStylesAndData();

    this.studyZoneService.allObservations.subscribe((allObservations) => {
      this.observations = allObservations;

      this.getStudyZoneTypes();
      this.getIntensities();
      this.getHedonicTones();
      this.getObservationOrderByTypeAndMonth();
    });
  }

  ngAfterViewInit(): void {

    const reportsElements = this.pdfService.reportsElements.getValue();

    this.pdfService.reportsElements.next({
      ...reportsElements,
      6: this.registerTimeChart,
    });
  }

  private getChartStylesAndData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.5044,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,

          },
        },
      },
      scales: {
        x: {
          stacked: true,
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
        y: {
          stacked: true,
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
      },
    };
  }

  public getObservationOrderByTypeAndHourRange() {
    this.yLegend = 'Número de registros por horas';
    this.xLegend = 'Tiempo';

    let datasets: dataset[] = [];

    let dataType = this.dataTypeFilter === 'type' ? this.types : this.dataTypeFilter === 'intensity' ? this.intensities : this.hedonicTones;
    for (let element of dataType) {
      if (!element) continue;
      let dataset: dataset = {
        type: 'bar',
        label: element.name,
        backgroundColor: this.colors[this.dataTypeFilter][element.id],

        data: Array.from({ length: 24 }, (x, i) => this.observations.filter((observation) => {
          if (this.dataTypeFilter === 'type') return observation.relationships.odourSubType.relationships?.odourType?.id === element?.id;
          else if (this.dataTypeFilter === 'intensity') return observation.relationships.odourIntensity?.id === element?.id;
          else if (this.dataTypeFilter === 'hedonicTone') return observation.relationships.odourHedonicTone?.id === element?.id;
          return false;
          }).filter((observation) => new Date(observation.createdAt).getHours() === i ).length
        ),

      };
      datasets.push(dataset);
    }

    this.data = {
      labels: [
        '00:00h',
        '01:00h',
        '02:00h',
        '03:00h',
        '04:00h',
        '05:00h',
        '06:00h',
        '07:00h',
        '08:00h',
        '09:00h',
        '10:00h',
        '11:00h',
        '12:00h',
        '13:00h',
        '14:00h',
        '15:00h',
        '16:00h',
        '17:00h',
        '18:00h',
        '19:00h',
        '20:00h',
        '21:00h',
        '22:00h',
        '23:00h',
      ],
      datasets: datasets,
    };

    if(this.chart){
      this.getChartStylesAndData();
      this.chart.refresh();
    }
  }
  public getObservationOrderByTypeAndMonth() {
    this.yLegend = 'Número de registros por mes';
    this.xLegend = 'Tiempo';

    let datasets: dataset[] = [];

    let dataType =
      this.dataTypeFilter === 'type'
        ? this.types
        : this.dataTypeFilter === 'intensity'
        ? this.intensities
        : this.hedonicTones;

    for (let element of dataType) {
      if (!element) continue;
      let dataset: dataset = {
        type: 'bar',
        label: element.name,
        backgroundColor: this.colors[this.dataTypeFilter][element.id],
        data: Array.from(
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          (x, i) =>
            this.observations
              .filter((observation) => {
                if (this.dataTypeFilter === 'type')
                  return ( observation.relationships.odourSubType.relationships?.odourType?.id === element?.id );
                else if (this.dataTypeFilter === 'intensity')
                  return ( observation.relationships.odourIntensity?.id === element?.id );
                else if (this.dataTypeFilter === 'hedonicTone')
                  return ( observation.relationships.odourHedonicTone?.id === element?.id );
                return false;
              })
              .filter(
                (observation) =>
                  new Date(observation.createdAt).getMonth() === i + 1
              ).length
        ),
      };

      datasets.push(dataset);

    }

    this.data = {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],

      datasets: datasets,
    };

    if(this.chart){
      this.getChartStylesAndData();
      this.chart.refresh();
    }
  }

  public getObservationOrderByTypeAndSeason() {
    this.yLegend = 'Número de registros por estación';
    this.xLegend = 'Tiempo';
    let datasets: dataset[] = [];

    let dataType =
      this.dataTypeFilter === 'type'
        ? this.types
        : this.dataTypeFilter === 'intensity'
        ? this.intensities
        : this.hedonicTones;

    for (let element of dataType) {
      if (!element) continue;
      let dataset: dataset = {
        type: 'bar',
        label: element.name,
        backgroundColor: this.colors[this.dataTypeFilter][element.id],
        data: Array.from(
          [0, 0, 0, 0],
          (x, i) =>
            this.observations
              .filter((observation) => {
                if (this.dataTypeFilter === 'type')
                  return (
                    observation.relationships.odourSubType.relationships
                      ?.odourType?.id === element?.id
                  );
                else if (this.dataTypeFilter === 'intensity')
                  return (
                    observation.relationships.odourIntensity?.id === element?.id
                  );
                else if (this.dataTypeFilter === 'hedonicTone')
                  return (
                    observation.relationships.odourHedonicTone?.id ===
                    element?.id
                  );
                return false;
              })
              .filter((observation) => {
                let date = new Date(observation.createdAt);
                let month = date.getMonth();
                let day = date.getDate();
                if (
                  (month === 3 && day >= 21) ||
                  month === 4 ||
                  month === 5 ||
                  (month === 6 && day < 21)
                ) {
                  return i === 0; // Primavera
                } else if (
                  (month === 6 && day >= 21) ||
                  month === 7 ||
                  month === 8 ||
                  (month === 9 && day < 23)
                ) {
                  return i === 1; // Verano
                } else if (
                  (month === 9 && day >= 23) ||
                  month === 10 ||
                  month === 11 ||
                  (month === 12 && day < 21)
                ) {
                  return i === 2; // Otoño
                } else {
                  return i === 3; // Invierno
                }
              }).length
        ),
      };

      datasets.push(dataset);
    }

    this.data = {
      labels: ['Primavera', 'Verano', 'Otoño', 'Invierno'],
      datasets: datasets,
    };

    if(this.chart){
      this.getChartStylesAndData();
      this.chart.refresh();
    }
  }

  public getObservationOrderByTypeAndYear() {
    this.yLegend = 'Número de registros por año';
    this.xLegend = 'Tiempo';

    let datasets: dataset[] = [];

    let dataType =
      this.dataTypeFilter === 'type'
        ? this.types
        : this.dataTypeFilter === 'intensity'
        ? this.intensities
        : this.hedonicTones;

    for (let element of dataType) {
      if (!element) continue;
      let dataset: dataset = {
        type: 'bar',
        label: element.name,
        backgroundColor: this.colors[this.dataTypeFilter][element.id],
        data: Array.from(
          { length: this.lastYear - (this.firstYear - 1) },
          (x, i) =>
            this.observations
              .filter((observation) => {
                if (this.dataTypeFilter === 'type')
                  return (
                    observation.relationships.odourSubType.relationships
                      ?.odourType?.id === element?.id
                  );
                else if (this.dataTypeFilter === 'intensity')
                  return (
                    observation.relationships.odourIntensity?.id === element?.id
                  );
                else if (this.dataTypeFilter === 'hedonicTone')
                  return (
                    observation.relationships.odourHedonicTone?.id ===
                    element?.id
                  );
                return false;
              })
              .filter(
                (observation) =>
                  new Date(observation.createdAt).getFullYear() ===
                  this.firstYear + i
              ).length
        ),
      };

      datasets.push(dataset);
    }

    this.data = {
      labels: Array.from(
        { length: this.lastYear - (this.firstYear - 1) },
        (x, i) => (i + this.firstYear).toString()
      ),
      datasets: datasets,
    };

    if(this.chart){
      this.getChartStylesAndData();
      this.chart.refresh();
    }
  }

  public getStudyZoneTypes(): void {
    let types = this.observations.map((observation) => {
      let year = new Date(observation.createdAt).getFullYear();
      this.firstYear = Math.min(this.firstYear, year);
      this.lastYear = Math.max(this.lastYear, year);
      return observation.relationships.odourSubType.relationships?.odourType;
    });

    this.types = types.filter(
      (v, i, a) => a.findIndex((t) => t?.id === v?.id) === i
    );

    this.types = this.types.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));
  }

  private getIntensities(): void {
    this.intensities = this.observations
      .map((observation) => observation.relationships.odourIntensity)
      .filter((v, i, a) => a.findIndex((t) => t?.id === v?.id) === i);

    this.intensities = this.intensities.sort(
      (a, b) => (a?.id ?? 0) - (b?.id ?? 0)
    );
  }

  private getHedonicTones(): void {
    this.hedonicTones = this.observations
      .map((observation) => observation.relationships.odourHedonicTone)
      .filter((v, i, a) => a.findIndex((t) => t?.id === v?.id) === i);

    this.hedonicTones = this.hedonicTones.sort(
      (a, b) => (a?.id ?? 0) - (b?.id ?? 0)
    );
  }

  public changeTimeFilter(): void {
    if (this.timeFilter === 'hours') {
      this.getObservationOrderByTypeAndHourRange();
    } else if (this.timeFilter === 'months') {
      this.getObservationOrderByTypeAndMonth();
    } else if (this.timeFilter === 'seasons') {
      this.getObservationOrderByTypeAndSeason();
    } else if (this.timeFilter === 'years') {
      this.getObservationOrderByTypeAndYear();
    }
  }

  public getPercents(data: number[]): number {
    return Math.round(
      (data.reduce((a, b) => a + b, 0) * 100) / this.observations.length
    );
  }
  public getTotal(data: number[]): number {
    return Math.round(
      (data.reduce((a, b) => a + b, 0))
    );
  }

  ngOnDestroy() {}
}
