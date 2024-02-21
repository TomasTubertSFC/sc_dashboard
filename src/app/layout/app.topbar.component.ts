import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    @Output() toggleSidebar = new EventEmitter<void>();
    
    @ViewChild('menubutton') menuButton!: ElementRef;

    constructor() { }

    onToggleSidebar() {
        this.toggleSidebar.emit();
      }
}
