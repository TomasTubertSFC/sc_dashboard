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
  public doughnutData: any;
  public barData: any;
  public doughnutOptions: any;
  public barOptions: any;
  public observations: Observation[] = [];

  public intensityChartDoughnut:boolean = true;
  public intensityDoughnutData: any;
  public intensityBarData: any;
  public hedonicToneChartDoughnut:boolean = true;
  public hedonicToneDoughnutData: any;
  public hedonicToneBarData: any;
  public typeChartDoughnut:boolean = true;
  public typeDoughnutData: any;
  public typeBarData: any;
  public subtypeChartDoughnut:boolean = true;
  public subtypeDoughnutData: any;
  public subtypeBarData: any;

  private colors: {[filter: string]: {[key: number]:string}} = {
    ['type']:{
      [0]: '#000000',
      [1]: '#daf299',
      [2]: '#ffff9e',
      [3]: '#dfc4f2',
      [4]: '#ff8133',
      [5]: '#a2daf9',
      [6]: '#CCCCCC',
      [7]: '#FFFFFF',
    },
    ['intensity']:{
      [1]: "#b0f4f3",
      [2]: "#97d5ec",
      [3]: "#7eabe2",
      [4]: "#697cd8",
      [5]: "#5f53cf",
      [6]: "#733fc5",
      [7]: "#8a2dba",

    },
    ['hedonicTone']:{
      [1]: '#b2301a',
      [2]: '#cb351d',
      [3]: '#f4723e',
      [4]: '#fdaf6d',
      [5]: '#fcddae',
      [6]: '#73aea8',
      [7]: '#008c99',
      [8]: '#207793',
      [9]: '#001f50',
    }
  }

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
      this.getHedonicToneCharts();
      this.getTypeCharts();
      this.getSubtypeCharts();

    });
  }

  private getIntensityCharts() {
    const intensities: (undefined | OdourIntensity)[] = this.observations.map((observation) => observation.relationships.odourIntensity);

    //contador de valores de intensidad que devueve un array con los valores de intensidad
    const barData = Object.entries(intensities.reduce((acc:any, intensity) => {
      if(intensity === undefined) return acc;
      if(acc[intensity.id] === undefined){
        acc[intensity.id] = {label: intensity.name, value: 0};
      };
      acc[intensity.id].value ++;
      return acc;
    }, {})).sort((a:any, b:any) => b[1]['value'] - a[1]['value']);
    const barColors = barData.map((data:any) => this.colors['intensity'][data[0]]);

    //obtenemos los 3 valores de intensadad mas altos, el resto los sumamos en otros
    const doughnutData = barData.slice(0, 3).map((data:any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3);
    doughnutData.push(barData.slice(3).reduce((acc:any, data:any) => acc + data[1]['value'], 0));
    doughnutColors.push('#CCCCCC');

    this.intensityDoughnutData = {
      labels: barData.map((data:any) => data[1]['label']).slice(0, 3).concat(['Otros']),
      datasets: [
          {
              data: doughnutData,
              backgroundColor:doughnutColors,
              hoverOffset: 5
          }
      ]
    };
    this.intensityBarData = {
      labels: barData.map((data:any) => data[1]['label']),
      datasets: [
          {
            label: 'Observaciones',
            data: barData.map((data:any) => data[1]['value']),
            backgroundColor: barColors,
          }
      ]
    };
  }

  private getHedonicToneCharts() {
    const hedonicTones = this.observations.map((observation) => observation.relationships.odourHedonicTone);

    const barData = Object.entries(hedonicTones.reduce((acc:any, hedonicTone) => {
      if(hedonicTone === undefined) return acc;
      if(acc[hedonicTone.id] === undefined){
        acc[hedonicTone.id] = {label: hedonicTone.name, value: 0};
      };
      acc[hedonicTone.id].value ++;
      return acc;
    }, {})).sort((a:any, b:any) => b[1]['value'] - a[1]['value']);
    console.log(barData);
    const barColors = barData.map((data:any) => this.colors['hedonicTone'][data[0]]);

    const doughnutData = barData.slice(0, 3).map((data:any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3)
    doughnutData.push(barData.slice(3).reduce((acc:any, data:any) => acc + data[1]['value'], 0));
    doughnutColors.push('#CCCCCC');

    this.hedonicToneDoughnutData = {
      labels: barData.map((data:any) => data[1]['label']).slice(0, 3).concat(['Otros']),
      datasets: [
          {
              data: doughnutData,
              backgroundColor:doughnutColors,
              hoverOffset: 5
          }
      ]
    };
    this.hedonicToneBarData = {
      labels: barData.map((data:any) => data[1]['label']),
      datasets: [
          {
            label: 'Observaciones',
            data: barData.map((data:any) => data[1]['value']),
            backgroundColor: barColors,
          }
      ]
    };
  }

  private getTypeCharts() {
    const types = this.observations.map((observation) => observation.relationships.odourSubType.relationships?.odourType);

    const barData = Object.entries(types.reduce((acc:any, type) => {
      if(type === undefined) return acc;
      if(acc[type.id] === undefined){
        acc[type.id] = {label: type.name, value: 0};
      };
      acc[type.id].value ++;
      return acc;
    }, {})).sort((a:any, b:any) => b[1]['value'] - a[1]['value']);

    const barColors = barData.map((data:any) => this.colors['type'][data[0]]);

    const doughnutData = barData.slice(0, 3).map((data:any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3)
    doughnutData.push(barData.slice(3).reduce((acc:any, data:any) => acc + data[1]['value'], 0));
    doughnutColors.push('#CCCCCC');

    this.typeDoughnutData = {
      labels: barData.map((data:any) => data[1]['label']).slice(0, 3).concat(['Otros']),
      datasets: [
          {
              data: doughnutData,
              backgroundColor:doughnutColors,
              hoverOffset: 5
          }
      ]
    };
    this.typeBarData = {
      labels: barData.map((data:any) => data[1]['label']),
      datasets: [
          {
            label: 'Observaciones',
            data: barData.map((data:any) => data[1]['value']),
            backgroundColor: barColors,
          }
      ]
    };
  }

  private getSubtypeCharts() {
    const subtypes = this.observations.map((observation) => observation.relationships.odourSubType);

    const barData = Object.entries(subtypes.reduce((acc:any, subtype) => {
      if(subtype === undefined) return acc;
      if(acc[subtype.id] === undefined){
        acc[subtype.id] = {label: subtype.name, value: 0};
      };
      acc[subtype.id].value ++;
      return acc;
    }, {})).sort((a:any, b:any) => b[1]['value'] - a[1]['value']);

    const barColors = barData.map((data:any) => this.colors['type'][data[0]]);

    const doughnutData = barData.slice(0, 3).map((data:any) => data[1]['value']);
    const doughnutColors = barColors.slice(0, 3)
    doughnutData.push(barData.slice(3).reduce((acc:any, data:any) => acc + data[1]['value'], 0));
    doughnutColors.push('#CCCCCC');

    this.subtypeDoughnutData = {
      labels: barData.map((data:any) => data[1]['label']).slice(0, 3).concat(['Otros']),
      datasets: [
          {
              data: doughnutData,
              backgroundColor:doughnutColors,
              hoverOffset: 5
          }
      ]
    };
    this.subtypeBarData = {
      labels: barData.map((data:any) => data[1]['label']),
      datasets: [
          {
            label: 'Observaciones',
            data: barData.map((data:any) => data[1]['value']),
            backgroundColor: barColors,
          }
      ]
    };
  }

}
