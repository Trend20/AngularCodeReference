import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FinancialInstitutionService {
  private _financialInstitutionList = new BehaviorSubject<FinancialInstitution[]>([]);
  financialInstitutionList = this._financialInstitutionList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/financial-institution`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response:any)=>{
       this._financialInstitutionList.next(response.content)
    });
  }

  getFinancialInstitutionList() {

    return this.httpClient.get(`${environment.baseUrl}/financial-institution`, {params: new HttpParams()
      .set('page', 0)
      .set('size', 1000)});

  }
}

export interface FinancialInstitution {
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string
}
