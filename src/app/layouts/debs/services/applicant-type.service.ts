import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApplicantTypeService {
  private _applicantTypeList = new BehaviorSubject<ApplicantType[]>([]);
  applicantTypeList = this._applicantTypeList.asObservable();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/applicant-type`, {
      params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)
    }).subscribe((response: any) => {
      this._applicantTypeList.next(response.content);
    });
  }
}

export interface ApplicantType {
  id: string,
  name: string
}
