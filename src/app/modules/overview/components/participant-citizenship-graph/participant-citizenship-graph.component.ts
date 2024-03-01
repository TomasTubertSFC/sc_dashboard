import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participant-citizenship-graph',
  templateUrl: './participant-citizenship-graph.component.html',
  styleUrl: './participant-citizenship-graph.component.scss',
})
export class ParticipantCitizenshipGraphComponent implements OnInit {
  value: number = 0;

  totalUsers: number = 1000;

  activeUsers: number = 500;

  percentageOfActiveUsers: number = this.activeUsers / this.totalUsers;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
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
