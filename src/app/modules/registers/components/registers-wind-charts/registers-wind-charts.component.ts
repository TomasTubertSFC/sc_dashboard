import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Observation } from '../../../../models/observation';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-registers-wind-charts',
  templateUrl: './registers-wind-charts.component.html',
  styleUrl: './registers-wind-charts.component.scss'
})
export class RegistersWindChartsComponent implements OnInit, OnDestroy{

  @ViewChild('radarChart', { static: false }) radarChart!: UIChart;
  @ViewChild('barChart', { static: false }) barChart!: UIChart;

  private studyZone$!: Subscription;
  public data: any = [];
  public observations!: Observation[];
  public radarOptions!:any;
  public barOptions!:any;

  public chartRadar: boolean = true;
  public windFilter: string = 'direction';

  private colors: { [filter: string]: { [key: number]: string } } = {
    ['direction']: {
      [1]: '#ff6200', //'#b2301a',
      [2]: '#f5763e', //'#cb351d',
      [3]: '#f0805c', //'#f4723e',
      [4]: '#eb8a7b', //'#fdaf6d',
      [5]: '#e79190', //'#fcddae',
      [6]: '#e497a1', //'#73aea8',
      [7]: '#e19cb2', //'#008c99',
      [8]: '#dca6d1', //'#207793',
    },
    ['speed']: {
      [4]: '#b2301a',
      [3]: '#cb351d',
      [2]: '#f4723e',
      [1]: '#fdaf6d',
      [0]: '#fcddae',
    },
  };

  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit(): void {
    this.studyZone$ = this.studyZoneService.allObservations.subscribe((allObservations) => {
      this.observations = allObservations;
      this.getChartStylesAndOptions();
      this.getWindDirectionChartData();
    });

  }

  private getChartStylesAndOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.radarOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.60,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary
          },
          pointLabels: {
            color: textColorSecondary
          }
        }
      }
    };
    this.barOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        y: {
          stacked: true,
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
            text: 'Número de registros',
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
            text: 'dirección del viento',
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

  private getWindDirectionChartData(): any {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    let data:any = this.observations.reduce((acc:any, observation) => {
      const direction = observation.relationships.wind.deg;
      acc = acc.length === 0 ? new Array(8).fill(0) : acc;
      if (direction >= 0 && direction <= 22.5) {
        acc[0] = acc[0] ? acc[0] + 1 : 1;
      }
      else if (direction > 22.5 && direction <=  67.5) {
        acc[1] = acc[1] ? acc[1] + 1 : 1;
      }
      else if (direction > 67.5 && direction <= 112.5) {
        acc[2] = acc[2] ? acc[2] + 1 : 1;
      }
      else if (direction > 112.5 && direction <= 157.5) {
        acc[3] = acc[3] ? acc[3] + 1 : 1;
      }
      else if (direction > 157.5 && direction <= 202.5) {
        acc[4] = acc[4] ? acc[4] + 1 : 1;
      }
      else if (direction > 202.5 && direction <= 247.5) {
        acc[5] = acc[5] ? acc[5] + 1 : 1;
      }
      else if (direction > 247.5 && direction <= 292.5) {
        acc[6] = acc[6] ? acc[6] + 1 : 1;
      }
      else if (direction > 292.5 && direction <= 337.5) {
        acc[7] = acc[7] ? acc[7] + 1 : 1;
      }
      else{
        acc[0] = acc[0] ? acc[0] + 1 : 1;
      }
      return acc;
    }, []);

    let datasets = [
      {
          label: 'Número de observaciones/dirección del viento',
          borderColor: documentStyle.getPropertyValue('--primary-400'),
          pointBackgroundColor: documentStyle.getPropertyValue('--primary-400'),
          pointBorderColor: documentStyle.getPropertyValue('--primary-400'),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue('--primary-400'),
          data: data
      }
    ];
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

  }

  private getWindSpeedChartData(): any {

    let labels: string[];
    let datasets = [];

    if(this.chartRadar){
      let data:any =  this.observations.reduce((acc:any, observation) => {
        const speed = observation.relationships.wind.speed;
        acc = acc.length === 0 ? new Array(5).fill(0) : acc;
        if (speed >= 0 && speed <= 2) {
          acc[0] = acc[0] ? acc[0] + 1 : 1;
        }
        else if (speed > 2 && speed <= 19) {
          acc[1] = acc[1] ? acc[1] + 1 : 1;
        }
        else if (speed > 19 && speed <= 50) {
          acc[2] = acc[2] ? acc[2] + 1 : 1;
        }
        else if (speed > 50 && speed <= 87) {
          acc[3] = acc[3] ? acc[3] + 1 : 1;
        }
        else{
          acc[0] = acc[0] ? acc[0] + 1 : 1;
        }
        return acc;
      }, []);

      labels = [
        'Calma',
        'Flojos',
        'Moderados',
        'Fuertes',
        'Muy fuertes',
      ];
      datasets = [
        {
            label: 'Número de observaciones',
            data: data
        }
      ];
    }
    else{
      const windSpeeds = [
        {
          name: 'Calma',
          range: [0, 2]
        },
        {
          name: 'Flojos',
          range: [2, 19]
        },
        {
          name: 'Moderados',
          range: [19, 50]
        },
        {
          name: 'Fuertes',
          range: [50, 87]
        },
        {
          name: 'Muy fuertes',
          range: [87, 100]
        },
      ];
      for (const speed of windSpeeds) {
        const index = windSpeeds.indexOf(speed);
        let dataset = {
          label: speed.name,

          data: Array.from({ length: 8 }, (x, i) =>
            this.observations.filter((observation) => {
              return observation.relationships.wind.speed >= speed.range[0] && observation.relationships.wind.speed < speed.range[1]
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

          backgroundColor: this.colors['speed'][index],
          borderColor: this.colors['speed'][index],
          borderWidth: 1,
        };
        datasets.push(dataset);
      }

      labels = [
        'N',
        'NE',
        'E',
        'SE',
        'S',
        'SO',
        'O',
        'NO',
      ];

    }
    this.data = {
      labels: labels,
      datasets: datasets,
    };

  }
  public changeWindFilter(chartSelected: boolean = this.chartRadar): void {
    this.chartRadar = chartSelected;
    if (this.windFilter === 'direction') this.getWindDirectionChartData()
    else if (this.windFilter === 'speed') this.getWindSpeedChartData()

    if(this.radarChart) this.radarChart.refresh();
    if(this.barChart) this.barChart.refresh();

    this.getChartStylesAndOptions()

  }


  ngOnDestroy(): void {
    this.studyZone$.unsubscribe();
  }

}
