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
  selector: 'app-registers-wind-typology-charts',
  templateUrl: './registers-wind-typology-charts.component.html',
  styleUrl: './registers-wind-typology-charts.component.scss',
})
export class RegistersWindTypologyChartsComponent implements OnInit, OnDestroy {
  @ViewChild('registerTimeChart', { static: false }) registerTimeChart!: ElementRef;
  @ViewChild('chart', {static: false}) chart!: UIChart;

  public windTypeFilter: string = 'direction';
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
      this.getObservationOrderByTypeAndDirection();
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

  public getObservationOrderByTypeAndDirection() {
    this.yLegend = 'Número de registros';
    this.xLegend = 'Direcciones del viento';

    let datasets: dataset[] = [];

    let dataType = this.dataTypeFilter === 'type' ? this.types : this.dataTypeFilter === 'intensity' ? this.intensities : this.hedonicTones;
    for (let element of dataType) {
      if (!element) continue;
      let dataset: dataset = {
        type: 'bar',
        label: element.name,
        backgroundColor: this.colors[this.dataTypeFilter][element.id],

        data: Array.from({ length: 8 }, (x, i) => this.observations.filter((observation) => {
          if (this.dataTypeFilter === 'type') return observation.relationships.odourSubType.relationships?.odourType?.id === element?.id;
          else if (this.dataTypeFilter === 'intensity') return observation.relationships.odourIntensity?.id === element?.id;
          else if (this.dataTypeFilter === 'hedonicTone') return observation.relationships.odourHedonicTone?.id === element?.id;
          return false;
          }).filter((observation) => {
            const direction = observation.relationships.wind.deg;
            if (i === 0) return direction >= 0 && direction <= 22.5 || direction > 337.5 && direction <= 360;
            else if (i === 1) return direction > 22.5 && direction <=  67.5;
            else if (i === 2) return direction > 67.5 && direction <= 112.5;
            else if (i === 3) return direction > 112.5 && direction <= 157.5;
            else if (i === 4) return direction > 157.5 && direction <= 202.5;
            else if (i === 5) return direction > 202.5 && direction <= 247.5;
            else if (i === 6) return direction > 247.5 && direction <= 292.5;
            else if (i === 7) return direction > 292.5 && direction <= 337.5;
            else return false;
          }).length
        ),

      };
      datasets.push(dataset);
    }

    this.data = {
      labels: [
        'N',
        'NE',
        'E',
        'SE',
        'S',
        'SO',
        'O',
        'NO',
      ],
      datasets: datasets,
    };

    if(this.chart){
      this.getChartStylesAndData();
      this.chart.refresh();
    }
  }

  public getObservationOrderByTypeAndSpeed() {
    this.yLegend = 'Número de registros por estación';
    this.xLegend = 'Velocidad del viento (Km/h)';
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
        data: Array.from({ length: 5 }, (x, i) =>
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
                const speed = observation.relationships.wind.speed;
                if (i === 0) return speed >= 0 && speed <= 2;
                else if (i === 1) return speed > 2 && speed <= 19;
                else if (i === 2) return speed > 19 && speed <= 50;
                else if (i === 3) return speed > 50 && speed <= 87;
                else if (i === 4) return speed > 87
                else return false;
              }).length
        ),
      };

      datasets.push(dataset);
    }

    this.data = {
      labels: [
        'Calma 0-2 km/s',
        'Flojos 2-19 km/s',
        'Moderados 19-50 km/s',
        'Fuertes 50-87 km/s',
        'Muy fuertes > 87 km/s'
      ],
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
    if (this.windTypeFilter === 'direction') {
      this.getObservationOrderByTypeAndDirection();
    } else if (this.windTypeFilter === 'speed') {
      this.getObservationOrderByTypeAndSpeed();
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
