import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmploymentService {
  constructor(private httpClient: HttpClient) {
  }
}


