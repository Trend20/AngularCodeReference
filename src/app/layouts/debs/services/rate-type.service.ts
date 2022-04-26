import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RateTypeService {
  private _rateTypeList = new BehaviorSubject<RateType[]>([]);
  rateTypeList = this._rateTypeList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/rate-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response:any)=>{
          this._rateTypeList.next(response.content);
    });
  }
}

export class RateType {
  constructor(public id: string, public name: string) {
  }
}
