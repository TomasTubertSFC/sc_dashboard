import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app.sidebar.component.html',
})
export class AppSidebarComponent {
  constructor(
    public el: ElementRef) {}
}
