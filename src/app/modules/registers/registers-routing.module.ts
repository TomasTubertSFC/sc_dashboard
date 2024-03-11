import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistersPageComponent } from './registers-page/registers-page.component';

const routes: Routes = [
  {
    path: '',
    component: RegistersPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistersRoutingModule { }
