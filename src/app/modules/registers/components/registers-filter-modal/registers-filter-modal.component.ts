import { Component, Input} from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { StudyZone } from '../../../../models/study-zone';
import { OdourTypeData } from '../../../../models/odour-related-data';

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
  public hedonicTone: number[] = [1, 7];
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
  public intensity: number[] = [1, 5];
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
