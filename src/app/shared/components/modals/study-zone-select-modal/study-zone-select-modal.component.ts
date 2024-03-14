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

  constructor(
    private studyZoneService: StudyZoneService,
    private authService: AuthService,
    private router: Router,
    ) {
    this.studyZoneService.studyZoneModal.subscribe((open:boolean) => {
        if(this.studyZoneService.studyZoneId) this.dissmissable = true;
        this.visible = open;
    });
  }

  public selectStudyZone(id: number) {
    this.studyZoneService.getStudyZoneById(id);
    this.visible = false;
    if (this.authService.lastUrl) {
      this.router.navigate([this.authService.lastUrl]);
      this.authService.lastUrl = null;
    } else if(this.router.url === '/login'){
      this.router.navigate(['/dashboard']);
    }
  }

}
