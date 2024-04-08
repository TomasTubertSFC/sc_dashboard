import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-bar-chart',
  template: `<svg
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    [ngClass]="iconClass"
  >
    <path
      d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"
    />
  </svg>`,
})
export class BarChartComponent {
  @Input() iconClass: string = '';
}
