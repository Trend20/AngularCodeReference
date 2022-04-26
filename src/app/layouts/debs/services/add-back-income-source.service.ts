import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AddBackIncomeSourceService {
  constructor(private httpClient: HttpClient) {
  }
  searchAddBackIncomeSource(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/add-back-income-source`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)});
  }
}

export interface AddBackIncomeSource {
  id: string,
  name: string
}
