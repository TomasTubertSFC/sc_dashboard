import { Component } from '@angular/core';

@Component({
  selector: 'app-odour-episode-graph',
  templateUrl: './odour-episode-graph.component.html',
  styleUrl: './odour-episode-graph.component.scss',
})
export class OdourEpisodeGraphComponent {
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  odourEpisodes: number[] = [1, 2, 1, 0, 3, 0, 2];
}
