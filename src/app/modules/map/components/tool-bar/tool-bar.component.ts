import { Component, EventEmitter, Input, Output, Signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-map-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.scss',
})
export class MapToolBarComponent {
  @Input() showFilters?: WritableSignal<boolean>;
  @Input() isFilterActive: boolean = false;
  
  @Output() toggleActiveFilters: EventEmitter<void> = new EventEmitter<void>();

  activeFilters(): void {
    this.toggleActiveFilters.emit();
  }

  toggleShowFilters(): void {
    this.showFilters.set(!this.showFilters());
  }
}
