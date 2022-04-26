import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OccupationService {
  private _occupationList = new BehaviorSubject<Occupation[]>([]);
  occupationList = this._occupationList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/occupation`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 10000)}).subscribe((response:any) => {
          this._occupationList.next(response.content);
    });
  }
}

export interface Occupation {
  name: string,
  id: string
}
