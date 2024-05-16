import { Component, inject } from '@angular/core';
import { ObservationsService } from './services/observations/observations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  observationService: ObservationsService = inject(ObservationsService);


  ngOnInit(): void {
    this.observationService.getAllObservations();
  }
}
