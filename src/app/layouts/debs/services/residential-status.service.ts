import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResidentialStatusService {
  constructor(private httpClient: HttpClient) {
  }
  searchResidentialStatus(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/residential-status`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)});
  }
}

export interface ResidentialStatus {
  id: string,
  name: string
}
