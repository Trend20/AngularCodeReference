import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RepaymentTypeService {
  constructor(private httpClient: HttpClient) {
  }

  searchRepaymentType(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/repayment-type`, {
      params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)
    });
  }
}

export class RepaymentType {
  constructor(public id: string, public name: string) {
  }
}
