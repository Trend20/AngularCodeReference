import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaygIncomeSourceService {
  private _paygIncomeSourceList = new BehaviorSubject<PaygIncomeSource[]>([]);
  paygIncomeSourceList = this._paygIncomeSourceList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/payg-income-source`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response: any) => {
       this._paygIncomeSourceList.next(response.content);
    });
  }
}

export interface PaygIncomeSource {
  id: string,
  name: string
}
