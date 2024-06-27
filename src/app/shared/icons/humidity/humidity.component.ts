import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-humidity',
  template: `
    <svg
      [ngClass]="iconClass"
      height="40px"
      viewBox="0 -960 960 960"
      width="40px"
      fill="#e8eaed"
    >
      <path
        d="M480-100q-133 0-226.5-91.81-93.5-91.8-93.5-223.52 0-63.1 24.5-120.68Q209-593.6 254-637.67L480-860l226 222.33q45 44.07 69.5 101.66Q800-478.43 800-415.33q0 131.72-93.5 223.52Q613-100 480-100ZM226.67-415.33h506.66q0-49.67-19-94.5-19-44.84-53.66-78.84L480-766.67l-180.67 178q-34.66 34-53.66 78.86-19 44.87-19 94.48Z"
      />
    </svg>
  `,
  styles: ``,
})
export class HumidityComponent {
  @Input() iconClass: string = '';
}
