import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  WritableSignal,
  inject,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormFilterValues } from '../../../../models/forms';
import { MapService } from '../../../../services/map/map.service';

@Component({
  selector: 'app-overview-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class OverviewFiltersComponent implements OnInit {
  mapService = inject(MapService);

  @Input() showFilters?: WritableSignal<boolean>;
  @Input() isFilterActive: boolean = false;

  private debounceTimer?: NodeJS.Timeout;

  public typesFilter: { id: number; value: string }[] = [
    { id: 1, value: 'Sons naturals' },
    { id: 2, value: 'Éssers humans' },
    { id: 3, value: 'Soroll del trànsit' },
    { id: 4, value: 'Altres sorolls' },
  ];

  public filtersForm: FormGroup = new FormGroup({
    type: new FormControl(false, []),
    typeFilter: new FormGroup({}),
    soundPressure: new FormControl(false, []),
    soundPressureFilter: new FormControl(35, []),
    days: new FormControl(false, []),
    daysFilter: new FormControl([new Date(), new Date()], []),
    hours: new FormControl(false, []),
    hoursFilter: new FormControl([0, 23], []),
  });

  ngOnInit(): void {
    this.typesFilter.forEach((type) => {
      (this.filtersForm.get('typeFilter') as FormGroup).addControl(
        String(type.id),
        new FormControl(true, [])
      );
    });
    this.filtersForm.valueChanges.subscribe((values: FormFilterValues) => {
      
      //Check if any value of form is setted to toggle the showFilters button
      if(values.type || values.soundPressure || values.days || values.hours){
        this.mapService.isFilterActive.next(true);
      } else {
        this.mapService.isFilterActive.next(false);
      }

      //I want to create a debounce
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.filterData(values);
      }, 500);
    });
  }

  //Podría llamar a un servicio que lo que hace es encargarse de filtrar los datos.
  private filterData(values: FormFilterValues): void {
    this.mapService.filterMapObservations(values);
  }
}
