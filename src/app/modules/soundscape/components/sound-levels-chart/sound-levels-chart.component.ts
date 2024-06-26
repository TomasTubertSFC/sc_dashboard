import { Component, Input } from '@angular/core';
import { Observations } from '../../../../models/observations';

@Component({
  selector: 'app-sound-levels-chart',
  templateUrl: './sound-levels-chart.component.html',
  styleUrl: './sound-levels-chart.component.scss'
})
export class SoundLevelsChartComponent {
  @Input() observations: Observations[];
  @Input() chartTitle: string;
}
