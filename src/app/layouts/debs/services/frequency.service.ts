import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FrequencyService {
  private _frequencyList = new BehaviorSubject<Frequency[]>([]);
  frequencyList = this._frequencyList.asObservable();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/frequency`, {
      params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)
    }).subscribe((response: any) => {
      this._frequencyList.next(response.content);
    });

  }

  getFrequencyList() {
    return this.httpClient.get(`${environment.baseUrl}/frequency`, {
      params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)
    })
  }


}

export interface Frequency {
  name: string,
  id: string
}
