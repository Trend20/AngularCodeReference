import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ExpenseTypeService {
  private _smsfExpenseTypeList = new BehaviorSubject<Expense[]>([]);
  smsfExpenseTypeList = this._smsfExpenseTypeList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/smsf-expense-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response: any)=>{
          this._smsfExpenseTypeList.next(response.content);
    });
  }

  getExpenseTypeList() {
    return this.httpClient.get(`${environment.baseUrl}/smsf-expense-type`, {params: new HttpParams()
      .set('page', 0)
      .set('size', 1000)})
  }
}

export interface Expense {
  id: string,
  description: string
}
