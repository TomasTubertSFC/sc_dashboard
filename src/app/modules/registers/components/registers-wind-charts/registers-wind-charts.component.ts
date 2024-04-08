import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Observation } from '../../../../models/observation';

@Component({
  selector: 'app-registers-wind-charts',
  templateUrl: './registers-wind-charts.component.html',
  styleUrl: './registers-wind-charts.component.scss'
})
export class RegistersWindChartsComponent implements OnInit, OnDestroy{

  private studyZone$!: Subscription;
  public data: any = [];
  public observations!: Observation[];
  public options!:any;

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
      [1]: '#b2301a',
      [2]: '#cb351d',
      [3]: '#f4723e',
      [4]: '#fdaf6d',
      [5]: '#fcddae',
    },
  };

  constructor(private studyZoneService: StudyZoneService) { }

  ngOnInit(): void {
    this.studyZone$ = this.studyZoneService.allObservations.subscribe((allObservations) => {
      this.observations = allObservations;
      this.getChartStylesAndData();
      this.getWindDirectionChartData();
    });

  }
  private getChartStylesAndData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      this.options = {
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
  }
  getWindDirectionChartData(): any {
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

  ngOnDestroy(): void {
    this.studyZone$.unsubscribe();
  }

}
