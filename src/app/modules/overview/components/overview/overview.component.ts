import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PdfService } from '../../../../services/pdf/pdf.service';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { OdourType, Episode } from '../../../../models/study-zone';
import { Subscription } from 'rxjs';

interface OverviewStudyZone {
  initDate: Date;
  endDate: Date;
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
  @ViewChild('nuisanceDegreeGraph', { static: false })
  nuisanceDegreeGraph!: ElementRef;
  @ViewChild('odourEpisodeGraph', { static: false })
  odourEpisodeGraph!: ElementRef;
  @ViewChild('participantCitizenshipGraph', { static: false })
  participantCitizenshipGraph!: ElementRef;

  private studyZone$!: Subscription;

  public studyZone!: OverviewStudyZone;
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
        initDate: new Date(studyZone.initDate),
        endDate: new Date(studyZone.endDate),
        totalUsers: totalUsers,
        activeUsers: totalActiveUsers,
        types: types,
        subtypes: subtypes,
      } as OverviewStudyZone;

      this.studyZone = studyZoneOverview;
      this.episodes = studyZone.episodes;
    });
  }

  ngAfterViewInit(): void {
    const reportsElements = this.pdfService.reportsElements.getValue();

    this.pdfService.reportsElements.next({
      ...reportsElements,
      0: this.nuisanceDegreeGraph,
      1: this.odourEpisodeGraph,
      2: this.participantCitizenshipGraph,
    });
  }

  ngOnDestroy(): void {
    this.studyZone$.unsubscribe();
  }
}
