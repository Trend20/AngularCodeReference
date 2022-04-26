import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApplicantExpenseTypeService {
  constructor(private httpClient: HttpClient) {
  }
  searchApplicantExpenseType(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/applicant-expense-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)});
  }
}

export interface ApplicantExpenseType {
  id: string,
  name: string,
  description: string,
  index: number
}
