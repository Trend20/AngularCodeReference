import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {PaygIncomeSource} from "./payg-income-source.service";

@Injectable({
  providedIn: 'root'
})
export class EntityTypeService {
  private _entityTypeList = new BehaviorSubject<EntityType[]>([]);
  entityTypeList = this._entityTypeList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/entity-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response:any)=> {
       this._entityTypeList.next(response.content);
    });
  }
}

export interface EntityType {
  name: string,
  id: string
}
