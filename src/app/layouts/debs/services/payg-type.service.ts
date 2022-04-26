import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaygTypeService {
  private _paygTypeList = new BehaviorSubject<PaygType[]>([]);
  paygTypeList = this._paygTypeList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/payg-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response:any) => {
          this._paygTypeList.next(response.content);
    });
  }
}

export interface PaygType {
  id: string,
  name: string
}
