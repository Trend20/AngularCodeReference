import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SupplementaryIncomeSourceService {
  constructor(private httpClient: HttpClient) {
  }
  searchSupplementaryIncomeSource(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/supplementary-income-source`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)});
  }
}

export interface SupplementaryIncomeSource {
  id: string,
  name: string
}
