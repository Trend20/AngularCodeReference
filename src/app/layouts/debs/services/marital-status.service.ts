import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {
  private _maritalStatusList = new BehaviorSubject<MaritalStatus[]>([]);
  maritalStatusList = this._maritalStatusList.asObservable();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/marital-status`, {
      params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)
    }).subscribe((response: any) => {
      this._maritalStatusList.next(response.content);
    });
  }
}

export interface MaritalStatus {
  id: string,
  name: string
}
