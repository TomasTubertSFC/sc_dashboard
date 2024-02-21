import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    { label: 'Resumen', icon: '', routerLink: ['/'] },
                    { label: 'Episodios de olor', icon: '', routerLink: ['/episodios'] },
                    { label: 'Registros de olor', icon: '', routerLink: ['/registros'] },
                    { label: 'Informes', icon: '',  command: () => {console.log('command')} },
                    { label: 'Descargar CSV', icon: '', command: () => {console.log('command')} },
                ]
            },
        ];
    }
}
