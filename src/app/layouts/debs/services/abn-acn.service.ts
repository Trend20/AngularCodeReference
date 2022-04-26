import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Abn} from "../models/abn.model";
import {BaseService} from "../../../services/base.service";

@Injectable({
  providedIn: 'root'
})
export class AbnAcnService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super()
  }

  lookUpABN(abnCode: string): Observable<any> {
    return this.httpClient.post(environment.abnLookupUrl, {data: {ABNLookupText: abnCode}}, {headers: {Authorization: `Bearer ${this.getAccessToken()}`}});
  }

  parseABNData(data: any): Abn {
    let row = data?.Data?.Data[0];
    let abn = new Abn();
    abn.id = row?.ABNId
    abn.status = row?.ABNStatus
    abn.businessInformation = row?.BusinessInformation
    abn.entityName = row?.EntityName
    abn.entityType = row?.EntityType
    abn.gst = row?.GST
    abn.mainBusinessLocation = row?.MainBusinessLocation
    return abn
  }
}
