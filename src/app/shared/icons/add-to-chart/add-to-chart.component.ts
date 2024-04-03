import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-add-to-chart',
  template: `
    <svg height="24" viewBox="0 -960 960 960" width="24" [ngClass]="iconClass">
      <path
        d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm80-160h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160Zm80-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM480-480Z"
      />
    </svg>
  `,
})
export class AddToChartComponent {
  @Input() iconClass: string = '';
}
