import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RetiredTypeService {
  private _retiredTypeList = new BehaviorSubject<RetiredType[]>([]);
  retiredTypeList = this._retiredTypeList.asObservable();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/retired-type`, {
      params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)
    }).subscribe((response: any) => {
      this._retiredTypeList.next(response.content);
    });
  }
}

export interface RetiredType {
  id: string,
  name: string
}
