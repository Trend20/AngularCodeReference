import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  constructor(private httpClient: HttpClient) {
  }
}
