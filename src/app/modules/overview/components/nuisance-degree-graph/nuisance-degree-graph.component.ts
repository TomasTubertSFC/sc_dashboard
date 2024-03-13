import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';
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

    const colorPlugin = {
      id: 'colorPlugin',
      beforeDatasetDraw: (chart: any, args: any, options: any) => {
        const ctx = chart.ctx;
        const dataset = chart.data.datasets[args.index];
        const yScale = chart.scales['y'];

        dataset.data.forEach((value: any, index: any) => {
          const yPos = yScale.getPixelForValue(value);
          const xPos = chart.getDatasetMeta(args.index).data[index].x;

          // Draw circle at the top of the bar
          ctx.beginPath();
          ctx.arc(xPos, yPos, 10, 0, 2 * Math.PI);
          ctx.fillStyle = 'black';
          ctx.fill();
        });
      },
      beforeDraw: (chart: any) => {
        const ctx = chart.canvas.getContext('2d');
        const xAxis = chart.scales['x'];
        const yAxis = chart.scales['y'];

        // Blue color from 0 to 18
        ctx.fillStyle = barColors.optimo.backgroundColor;
        const blueStart = xAxis.getPixelForValue(0);
        const blueEnd = xAxis.getPixelForValue(18);
        ctx.fillRect(
          blueStart,
          yAxis.bottom,
          blueEnd - blueStart,
          yAxis.top - yAxis.bottom
        );
        // Set the border color
        ctx.strokeStyle = barColors.optimo.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          blueStart,
          yAxis.bottom,
          blueEnd - blueStart,
          yAxis.top - yAxis.bottom
        );

        // Green color from 18 to 35
        ctx.fillStyle = barColors.mejorable.backgroundColor;
        const greenStart = xAxis.getPixelForValue(18);
        const greenEnd = xAxis.getPixelForValue(35);
        ctx.fillRect(
          greenStart,
          yAxis.bottom,
          greenEnd - greenStart,
          yAxis.top - yAxis.bottom
        );
        // Set the border color
        ctx.strokeStyle = barColors.mejorable.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          greenStart,
          yAxis.bottom,
          greenEnd - greenStart,
          yAxis.top - yAxis.bottom
        );

        // Yellow color from 35 to 68
        ctx.fillStyle = barColors.grave.backgroundColor;
        const yellowStart = xAxis.getPixelForValue(35);
        const yellowEnd = xAxis.getPixelForValue(68);
        ctx.fillRect(
          yellowStart,
          yAxis.bottom,
          yellowEnd - yellowStart,
          yAxis.top - yAxis.bottom
        );
        // Set the border color
        ctx.strokeStyle = barColors.grave.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          yellowStart,
          yAxis.bottom,
          yellowEnd - yellowStart,
          yAxis.top - yAxis.bottom
        );

        // Red color from 68 to 100
        ctx.fillStyle = barColors.critico.backgroundColor;
        const redStart = xAxis.getPixelForValue(68);
        const redEnd = xAxis.getPixelForValue(100);
        ctx.fillRect(
          redStart,
          yAxis.bottom,
          redEnd - redStart,
          yAxis.top - yAxis.bottom
        );
        // Set the border color
        ctx.strokeStyle = barColors.critico.borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          redStart,
          yAxis.bottom,
          redEnd - redStart,
          yAxis.top - yAxis.bottom
        );
      },
    };

    const customDataLabels = {
      id: 'customDataLabels',
      afterDatasetDraw: (chart: any, args: any, pluginsOptions: any) => {
        const {
          ctx,
          data,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;

        const dataset = chart.data.datasets[args.index];
        console.log('dataset', dataset);
        dataset.data.forEach((value: any, index: any) => {
          ctx.save();
          ctx.font = '1rem Space Grotesk';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'end';
          const yPos = (top + bottom) / 2; // Position in the middle of the y-axis
          const xPos = chart.getDatasetMeta(args.index).data[index].x;
          if (value) {
            ctx.translate(xPos, yPos); // Move the origin to the point where the text will be drawn
            ctx.rotate(-Math.PI / 2); // Rotate the context by 90 degrees
            ctx.textAlign = 'center';
            let date = new Date(dataset.date[index]);
            let formattedDate = date
              .toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
              })
              .toUpperCase();
            ctx.fillText(formattedDate, 0, -15); // Draw the text at the new origin
            ctx.restore();
          }
        });
      },
    };

    // Register the plugin globally
    Chart.register(colorPlugin);
    // Register the plugin globally
    Chart.register(customDataLabels);

    const data = () => {
      const arr = Array.from({ length: 101 }, (_, i) => i);
      let episodes = [
        { degree: 15, date: new Date(2022, 0, 1) },
        { degree: 20, date: new Date(2022, 1, 1) },
        { degree: 40, date: new Date(2022, 2, 1) },
        { degree: 60, date: new Date(2022, 3, 1) },
      ];
      return arr.map((_, i) => {
        const episode = episodes.find((e) => e.degree === i);
        return episode ? { value: 98, date: episode.date } : null;
      });
    };

    this.basicData = {
      labels: Array.from({ length: 101 }, (_, i) => i),
      datasets: [
        {
          data: data().map((d) => (d ? d.value : null)),
          date: data().map((d) => (d ? d.date : null)),
          backgroundColor: 'black',
          borderWidth: 0.5,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        colorPlugin,
        customDataLabels,
      },
      scales: {
        y: {
          max: 100,
          beginAtZero: true,
          grace:10,
          ticks: {
            display: false,
            color: 'transparent',
          },
          grid: {
            display: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
            // This will only display labels where the value is a multiple of 10
            callback: function (value: any, index: any, values: any) {
              return value % 10 === 0 ? value : '';
            },
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
      animation: false,
    };
  }

  showDialog() {
    this.visible = true;
  }
}
