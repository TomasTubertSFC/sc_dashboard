import { Component } from '@angular/core';

@Component({
  selector: 'app-observation-numbers',
  templateUrl: './observation-numbers.component.html',
  styleUrl: './observation-numbers.component.scss',
})
export class ObservationNumbersComponent {
  dataGenre: any[] = [
    { genre: 'Dones', value: '25%' },
    { genre: 'Homes', value: '25%' },
    { genre: 'Altres', value: '25%' },
    { genre: 'No binario', value: '24%' },
    { genre: 'Prefereixo no dir-ho', value: '1%' },
  ];

  dataAge: any[] = [
    { age: '18', value: '20%' },
    { age: '19-34', value: '25%' },
    { age: '30-40', value: '24%' },
    { age: '40-50', value: '1%' },
    { age: '>50', value: '1%' },
  ];
}
