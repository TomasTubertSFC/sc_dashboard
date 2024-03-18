import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-participant-citizenship-graph',
  templateUrl: './participant-citizenship-graph.component.html',
  styleUrl: './participant-citizenship-graph.component.scss',
})
export class ParticipantCitizenshipGraphComponent implements OnInit {
  value: number = 0;

  @Input() totalUsers: number = 1000;

  @Input() activeUsers: number = 500;

  percentageOfActiveUsers: number = this.activeUsers / this.totalUsers;

  backgroundColor!: string;

  get usersPercentage(): number {
    return Math.round((this.value / 100) * this.totalUsers * 10) / 10;
  }
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    this.backgroundColor = documentStyle.getPropertyValue('--violet');

    let interval = setInterval(() => {
      this.value = this.value + 1;
      if (this.value >= this.percentageOfActiveUsers * 100) {
        this.value = this.percentageOfActiveUsers * 100;
        clearInterval(interval);
      }
      this.cdr.detectChanges();
    }, 100);
  }
}
