import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AssetTypeService {
  private _assetTypeList = new BehaviorSubject<AssetType[]>([]);
  assetTypeList = this._assetTypeList.asObservable();
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${environment.baseUrl}/asset-type`, {params: new HttpParams()
        .set('page', 0)
        .set('size', 1000)}).subscribe((response:any)=> {
          this._assetTypeList.next(response.content);
    });
  }

  getAssetTypeList() {
    return this.httpClient.get(`${environment.baseUrl}/asset-type`, {params: new HttpParams()
      .set('page', 0)
      .set('size', 1000)})
  }
}

export interface AssetType {
  id: string,
  name: string
}
