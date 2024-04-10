import { Component, EventEmitter, Input, Output} from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { OdourType, StudyZone } from '../../../../models/study-zone';
import { OdourTypeData } from '../../../../models/odour-related-data';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registers-filter-modal',
  templateUrl: './registers-filter-modal.component.html',
  styleUrl: './registers-filter-modal.component.scss'
})
export class RegistersFilterModalComponent {

  @Input() filterSidebarVisible: boolean = false;

  @Output('filtersOutput') filtersOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output('closeFilterSidebar') closeFilterSidebar: EventEmitter<any> = new EventEmitter<any>();

  private studyZone!:StudyZone;

  public odourTypes!:OdourTypeData[]
  public hedonicToneTitle: string[] = [
    'Extremadamente desagradable',
    'Muy desagradable',
    'Desagradable',
    'Ligeramente desagradable',
    'Neutro',
    'Ligeramente agradable',
    'Agradable',
    'Muy agradable',
    'Extremadamente agradable'
  ];
  public intensityTitle: string[] = [
    'Imperceptible',
    'Muy débil',
    'Débil',
    'Distinguible ',
    'Fuerte',
    'Muy fuerte',
    'Extremadamente fuerte'
  ];
  public days: Date[] = [new Date(), new Date()];
  public hours: Date = new Date();

  public typeFilter: FormGroup = new FormGroup({});

  public filtersForm: FormGroup = new FormGroup({
    type: new FormControl(false, []),
    typeFilter: this.typeFilter,
    hedonicTone: new FormControl(false, []),
    hedonicToneFilter: new FormControl([-4, 4], []),
    intensity: new FormControl(false, []),
    intensityFilter: new FormControl([0, 6], []),
    days: new FormControl(false, []),
    daysFilter: new FormControl([new Date(), new Date()], []),
    hours: new FormControl(false, []),
    hoursFilter: new FormControl([0, 23], []),
  });

  constructor(private studyZoneService: StudyZoneService) {
    this.studyZoneService.studyZone.subscribe((studyZone) => {
      if (studyZone) {
        this.studyZone = studyZone;
        this.odourTypes = this.getStudyZoneTypes();
      }
    })

    this.filtersForm.valueChanges.subscribe((value) => {
      this.filtersOutput.emit(value);
    });
  };

  public getStudyZoneTypes(): any[] {
    let types = this.studyZone.episodes.map(
        episode => episode.observations.map(
          observation => observation.relationships.odourSubType.relationships?.odourType
          )
      ).flat()

    types.push(...this.studyZone.restObservations.map(
      observation => observation.relationships.odourSubType.relationships?.odourType
      ));

    types = types.filter(
      (v, i, a) => a.findIndex(t => (t?.id === v?.id)) === i
      )

    for(let type of types){
      this.typeFilter.addControl(String(type?.id), new FormControl(true, []) );
    }

    return types;
  }

  public closeFilters(): void {
    this.closeFilterSidebar.emit();
  }

}
