import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesPageComponent } from './episodes-page/episodes-page.component';

const routes: Routes = [
  {
    path: '',
    component: EpisodesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpisodesRoutingModule { }
