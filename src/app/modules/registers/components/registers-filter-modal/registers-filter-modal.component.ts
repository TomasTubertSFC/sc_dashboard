import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-registers-filter-modal',
  templateUrl: './registers-filter-modal.component.html',
  styleUrl: './registers-filter-modal.component.scss'
})
export class RegistersFilterModalComponent {

  @Input() filterSidebarVisible: boolean = false;

  //FILTROS
  public filterOptions: {
    type: boolean,
    hedonicTone: boolean,
    intensity: boolean,
    days: boolean,
    hours: boolean,
  } = {
    type: false,
    hedonicTone: false,
    intensity: false,
    days: false,
    hours: false,
  };

}
