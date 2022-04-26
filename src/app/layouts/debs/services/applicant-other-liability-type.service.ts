import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApplicantOtherLiabilityTypeService {
  constructor(private httpClient: HttpClient) {
  }
  searchApplicantOtherLiabilityType(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/applicant-other-liability-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)});
  }
}

export interface ApplicantOtherLiabilityType {
  id: string,
  name: string
}
