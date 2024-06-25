import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-thermostat',
  template: `
    <svg
      [ngClass]="iconClass"
      height="40px"
      viewBox="0 -960 960 960"
      width="40px"
      fill="#e8eaed"
    >
      <path
        d="M480-80q-83 0-141.5-58.5T280-280q0-50 22.33-93.83 22.34-43.84 65-68.17v-325.33q0-46.95 32.86-79.81Q433.06-880 480-880q46.94 0 79.81 32.86 32.86 32.86 32.86 79.81V-442q42.66 24.33 65 68.17Q680-330 680-280q0 83-58.5 141.5T480-80Zm-46-436.67h92v-48.66h-46v-39.34h46v-84.66h-46v-39h46v-39q0-19.55-13.25-32.78-13.25-13.22-32.83-13.22-19.59 0-32.75 13.22Q434-786.88 434-767.33v250.66Z"
      />
    </svg>
  `,
  styles: ``,
})
export class ThermostatComponent {
  @Input() iconClass: string = '';
}
