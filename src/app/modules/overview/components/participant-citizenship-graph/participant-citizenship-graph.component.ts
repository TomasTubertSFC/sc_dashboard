import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-participant-citizenship-graph',
  templateUrl: './participant-citizenship-graph.component.html',
  styleUrl: './participant-citizenship-graph.component.scss',
})
export class ParticipantCitizenshipGraphComponent implements OnInit {
  @Input() totalUsers!: number;

  @Input() activeUsers!: number;

  percentageOfActiveUsers!: number;

  backgroundColor!: string;

  constructor() {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    this.backgroundColor = documentStyle.getPropertyValue('--violet');
    this.percentageOfActiveUsers = (this.totalUsers / this.activeUsers) * 100;
  }
}
