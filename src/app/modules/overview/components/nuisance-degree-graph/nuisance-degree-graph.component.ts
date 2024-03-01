import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nuisance-degree-graph',
  templateUrl: './nuisance-degree-graph.component.html',
  styleUrl: './nuisance-degree-graph.component.scss',
})
export class NuisanceDegreeGraphComponent implements OnInit {
  basicData: any;

  basicOptions: any;

  visible: boolean = false;

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const barColors = {
      optimo: {
        backgroundColor: documentStyle.getPropertyValue('--blue-transparency'),
        borderColor: documentStyle.getPropertyValue('--blue'),
      },
      mejorable: {
        backgroundColor: documentStyle.getPropertyValue('--green-transparency'),
        borderColor: documentStyle.getPropertyValue('--green'),
      },
      grave: {
        backgroundColor: documentStyle.getPropertyValue(
          '--yellow-transparency'
        ),
        borderColor: documentStyle.getPropertyValue('--yellow'),
      },
      critico: {
        backgroundColor: documentStyle.getPropertyValue(
          '--orange-transparency'
        ),
        borderColor: documentStyle.getPropertyValue('--orange'),
      },
    };

    const backgroundColors = Object.values(barColors).map(
      (color) => color.backgroundColor
    );
    const borderColors = Object.values(barColors).map(
      (color) => color.borderColor
    );

    this.basicData = {
      labels: ['Optimo', 'Mejorable', 'Grave', 'Crítico'],
      datasets: [
        //Cada dataset por més del proyecto
        {
          label: 'Enero',
          data: [1, 0, 1, 1],
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          borderWidth: 1,
        },
        {
          label: 'Febrero',
          data: [0, 1, 0, 1],
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          borderWidth: 1,
        },
        {
          label: 'Marzo',
          data: [0, 0, 1, 0],
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          borderWidth: 1,
        },
        {
          label: 'Abril',
          data: [1, 1, 0, 0],
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            boxWidth: 0,
            font: {
              family: 'Space Grotesk',
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'transparent',
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  showDialog() {
    this.visible = true;
  }
}
