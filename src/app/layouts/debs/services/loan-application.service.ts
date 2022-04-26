import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {PaginationData} from "../models/pagination-data.model";
import {BaseService} from "../../../services/base.service";

@Injectable({providedIn: 'root'})
export class LoanApplicationService extends BaseService {
  loanPurposeMap = [{key: 'Purchase', value: 'PURCHASE'}, {key: 'Refinance', value: 'REFINANCE'}]

  constructor(private httpClient: HttpClient) {
    super()
  }

  getLoanApplicationList(paginationData: PaginationData, orderBy: string = 'createdAt', direction = 'ASC'): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/loan-application?size=${paginationData.pageSize}&sort=${orderBy},${direction}&page=${paginationData.currentPage}`, {headers: this.getHeaders()})
  }
  getLoanApplicationById(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/loan-application/${id}`, {headers: this.getHeaders()})
  }

  createLoanApplication(): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/loan-application`, {})
  }
}


