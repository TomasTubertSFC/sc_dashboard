import { Component, Input} from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { StudyZone } from '../../../../models/study-zone';
import { OdourTypeData } from '../../../../models/odour-related-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registers-filter-modal',
  templateUrl: './registers-filter-modal.component.html',
  styleUrl: './registers-filter-modal.component.scss'
})
export class RegistersFilterModalComponent {

  @Input() filterSidebarVisible: boolean = false;

  private studyZone!:StudyZone;

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
  public odourTypes!:OdourTypeData[]
  public hedonicToneTitle: string[] = [
    'Extremadamente desagradable',
    'Muy desagradable',
    'Desagradable',
    'Ligeramente desagradable',
    'Neutral',
    'Ligeramente agradable',
    'Agradable',
    'Muy agradable',
    'Extremadamente agradable'
  ];
  public intensityTitle: string[] = [
    'Imperceptible',
    'Muy débil',
    'Débil',
    'Indiferente ',
    'Fuerte',
    'Muy fuerte',
    'Extremadamente fuerte'
  ];
  public days: Date[] = [new Date(), new Date()];
  public hours: Date = new Date();

  filtersForm: FormGroup = new FormGroup({
    type: new FormControl(false, []),
    typeFilter: new FormControl([], []),
    hedonicTone: new FormControl(false, []),
    hedonicToneFilter: new FormControl([1, 7], []),
    intensity: new FormControl(false, []),
    intensityFilter: new FormControl([1, 5], []),
    days: new FormControl(false, []),
    daysFilter: new FormControl([new Date(), new Date()], []),
    hours: new FormControl(false, []),
    hoursFilter: new FormControl(new Date(), []),
  });


  constructor(private studyZoneService: StudyZoneService) {
    this.studyZoneService.studyZone.subscribe((studyZone) => {
      if (studyZone) {
        this.studyZone = studyZone;
        this.odourTypes = this.getStudyZoneTypes();
      }
    })
  };

  public getStudyZoneTypes(): any[] {
    return this.studyZone.episodes.map(
        episode => episode.observations.map(
          observation => observation.relationships.odourSubType.relationships?.odourType
          )
      ).flat()
      .filter(
        (v, i, a) => a.findIndex(t => (t?.id === v?.id)) === i
        );
  }

}
