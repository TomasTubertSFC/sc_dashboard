import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { StudyZoneService } from '../services/study-zone.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const studyZoneService: StudyZoneService = inject(StudyZoneService);
  const router: Router = inject(Router);

  if (!authService.isLoggedIn.value) {
    router.navigate(['/login']);
    return false;
  }
  else if (!studyZoneService.studyZoneId) {
    studyZoneService.studyZoneModal = true;
    return true;
  }


  return true;
};
