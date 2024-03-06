import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class MenuService {

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();
    private _sidebarMenuIsOpen = new Subject<boolean>();

    get sidebarMenuIsOpen():Observable<boolean> {
        return this._sidebarMenuIsOpen.asObservable();
    }
    set sidebarMenuIsOpen(value: boolean) {
        this._sidebarMenuIsOpen.next(value);
    }


    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    //Activate item with route
    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }
}
