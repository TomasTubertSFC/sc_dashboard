import { Component } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Observation } from '../../../../models/observation';
import { OdourIntensity } from '../../../../models/odour-related-data';
import { withHttpTransferCacheOptions } from '@angular/platform-browser';

@Component({
  selector: 'app-registers-typology-charts',
  templateUrl: './registers-typology-charts.component.html',
  styleUrl: './registers-typology-charts.component.scss'
})
export class RegistersTypologyChartsComponent {
  public doughnutData: any = {
    labels: ['Agradable', 'Desagradable', 'Neutro', 'Otros'],
    datasets: [
        {
            data: [300, 50, 100, 25],
            backgroundColor: ['#b2301a', '#f4723e', '#73aea8', '#CCCCCC'],
            hoverOffset: 5
        }
    ]
  };
  public barData: any = {
    labels: ['Agradable', 'Desagradable', 'Neutro', 'Otros'],
    datasets: [
        {
            data: [300, 50, 100, 25],
            backgroundColor: ['#b2301a', '#f4723e', '#73aea8', '#CCCCCC'],
            hoverOffset: 5
        }
    ]
  };
  public doughnutOptions: any;
  public barOptions: any;
  public observations: Observation[] = [];

  public intensityChartDoughnut:boolean = true;
  public hedonicToneChartDoughnut:boolean = true;
  public typeChartDoughnut:boolean = true;
  public subtypeChartDoughnut:boolean = true;
  constructor(
    private studyZoneService: StudyZoneService
  ) {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.doughnutOptions = {

      cutout: '60%',
      plugins: {
          legend: {
              labels: {
                  color: textColorSecondary
              }
          }
      }
    };
    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  };

  }

  ngOnInit() {
    this.studyZoneService.allObservations.subscribe((allObservations) => {
      this.observations = allObservations;

      this.getIntensityCharts();

    });
  }

  private getIntensityCharts() {
    const intensities: (undefined | OdourIntensity)[] = this.observations.map((observation) => observation.relationships.odourIntensity);

    let labels: string[] = [];
    //contador de valores de intensidad que devueve un array con los valores de intensidad
    const intensityBarData = Object.entries(intensities.reduce((acc:any, intensity) => {
      if(intensity === undefined) return acc;
      if(acc[intensity.id] === undefined){
        acc[intensity.id] = 0
        labels.push(intensity.name);
      };
      acc[intensity.id]++;
      return acc;
    }, {})).sort((a:any, b:any) => b[1] - a[1]);

    //obtenemos los 3 valores de intensadad mas altos, el resto los sumamos en otros
    const intensityDoughnutData = intensityBarData.slice(0, 3).map((data:any) => data[1]);
    intensityDoughnutData.push(intensityBarData.slice(3).reduce((acc:any, data:any) => acc + data[1], 0));

    const intensityData = intensityDoughnutData//this.getChartData(intensity);
    this.doughnutData = {
      labels: labels.slice(0, 3).concat(['Otros']),
      datasets: [
          {
              data: intensityData,
              backgroundColor: ['#b2301a', '#f4723e', '#73aea8', '#CCCCCC'],
              hoverOffset: 5
          }
      ]
    };
    this.barData = {
      labels: labels,
      datasets: [
          {
            label: 'Intensidad',
            data: intensityBarData.flat(),
            backgroundColor: ['#b2301a', '#f4723e', '#73aea8', '#CCCCCC', '#73aea8', '#73aea8'],
          }
      ]
    };
  }
}
