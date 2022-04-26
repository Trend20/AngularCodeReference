import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class tracKingSharedService {
    private subject = new Subject<any>();

    sendClickEvent(type: string) {

        this.subject.next(type);
    }
    sendLogoutEvent(data: string) {
        this.subject.next(data);
    }
    getLogoutClick(): Observable<any> {
        return this.subject.asObservable();
    }

    getClickEvent(): Observable<any> {
        return this.subject.asObservable();
    }

}