import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { PdfService } from '../../../../services/pdf/pdf.service';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { OdourType, Episode } from '../../../../models/study-zone';
import { Subscription } from 'rxjs';

interface OverviewStudyZone {
  initDate: string;
  endDate: string;
  totalUsers: number;
  activeUsers: number;
  types: OdourType[];
  subtypes: OdourType[];
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dataToExport', { static: false }) dataToExport!: ElementRef;
  private studyZone$!: Subscription;
  //Seguir con los filtros

  public studyZone!: OverviewStudyZone;
  // public _episodes!: WritableSignal<Episode[]>;
  public episodes!: Episode[];

  constructor(
    private pdfService: PdfService,
    private studyZoneService: StudyZoneService
  ) {}

  ngOnInit() {
    let studyZoneOverview;
    this.studyZone$ = this.studyZoneService.studyZone.subscribe((studyZone) => {
      if (!studyZone) return;
      const totalUsers = studyZone.episodes.reduce((acc, curr) => {
        return acc + curr.differentUsers;
      }, 0);

      const totalActiveUsers = studyZone.episodes.reduce((acc, curr) => {
        return acc + curr.participation;
      }, 0);

      const types = studyZone.episodes
        .flatMap((episode) => {
          return episode.type;
        })
        .sort((a, b) => Number(a.id) - Number(b.id))
        .reduce((acc: OdourType[], curr: OdourType, idx: number) => {
          if (!acc.length) return [curr];
          if (acc[acc.length - 1]?.id !== curr.id) return [...acc, curr];
          return acc;
        }, [] as OdourType[]);

      const subtypes = studyZone.episodes
        .flatMap((episode) => {
          return episode.subtype;
        })
        .sort((a, b) => Number(a.id) - Number(b.id))
        .reduce((acc: OdourType[], curr: OdourType, idx: number) => {
          if (!acc.length) return [curr];
          if (acc[acc.length - 1]?.id !== curr.id) return [...acc, curr];
          return acc;
        }, [] as OdourType[]);

      studyZoneOverview = {
        initDate: studyZone.initDate,
        endDate: studyZone.endDate,
        totalUsers: totalUsers,
        activeUsers: totalActiveUsers,
        types: types,
        subtypes: subtypes,
      } as OverviewStudyZone;

      //Mapeare desde el initDate hasta el endDate los meses para obtenerlos.
      this.studyZone = studyZoneOverview;
      this.episodes = studyZone.episodes;
      // this._episodes = signal(studyZone.episodes);
    });
  }

  ngAfterViewInit(): void {
    this.pdfService.elementToPdfRef.next(this.dataToExport);
  }

  ngOnDestroy(): void {
    this.studyZone$.unsubscribe();
  }
}
