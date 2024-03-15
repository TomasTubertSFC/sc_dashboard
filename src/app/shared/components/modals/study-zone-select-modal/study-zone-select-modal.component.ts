import { Component } from '@angular/core';
import { StudyZoneService } from '../../../../services/study-zone.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-study-zone-select-modal',
  templateUrl: './study-zone-select-modal.component.html',
  styleUrl: './study-zone-select-modal.component.scss'
})
export class StudyZoneSelectModalComponent {

  public visible: boolean = false;
  public dissmissable: boolean = false;
  public selectedStudyZone!: number;
  public studyZonesList: any[] = [];

  constructor(
    private studyZoneService: StudyZoneService,
    private authService: AuthService,
    private router: Router,
    ) {
    this.studyZoneService.studyZoneModal.subscribe((open:boolean) => {
        if(this.studyZoneService.studyZoneId){
          this.dissmissable = true;
          this.selectedStudyZone = this.studyZoneService.studyZoneId;
        }
        this.visible = open;
    });
    this.studyZoneService.getStudyZoneList().subscribe((data: any) => {
      this.studyZonesList = data.studyZonesList;
      console.log(this.studyZonesList);
    });
  }

  public selectStudyZone(id: number) {
    if(this.selectedStudyZone !== id){
      this.selectedStudyZone = id;
      this.studyZoneService.getStudyZoneById(id);
      if (this.authService.lastUrl) {
        this.router.navigate([this.authService.lastUrl]);
        this.authService.lastUrl = null;
      } else if(this.router.url === '/login'){
        this.router.navigate(['/dashboard']);
      }
    }
    this.visible = false;

  }

}
