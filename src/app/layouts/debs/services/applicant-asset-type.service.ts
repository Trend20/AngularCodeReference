import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApplicantAssetTypeService {
  constructor(private httpClient: HttpClient) {
  }
  searchApplicantAssetType(): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}/applicant-asset-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)});
  }
}

export interface ApplicantAssetType {
  id: string,
  name: string
}
