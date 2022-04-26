import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {formatDate} from "@angular/common";
import {BaseService} from "../../../services/base.service";


@Injectable({providedIn: 'root'})
export class ValuationService extends BaseService {

  private _securityDocumentList = new BehaviorSubject<SecurityDocument[]>([]);
  private _securityTypeList = new BehaviorSubject<SecurityType[]>([]);
  securityDocumentList = this._securityDocumentList.asObservable();
  securityTypeList = this._securityTypeList.asObservable();

  constructor(private httpClient: HttpClient) {
    super();
    httpClient.get(`${environment.baseUrl}/property-valuation-security-type`).subscribe((response: any) => {
      this._securityTypeList.next(response.content)
    });
    httpClient.get(`${environment.baseUrl}/property-valuation-security-document`).subscribe((response: any) => {
      this._securityDocumentList.next(response.content)
    });
  }

  save(propertyValuation: PropertyValuation): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/property-valuation`, propertyValuation, {headers: this.getHeaders()})
  }

  formatData(propertyValuationData: any): PropertyValuation {
    return {
      loanApplicationId: '',
      id: propertyValuationData.id,
      propertyValue: propertyValuationData.propertyValue?.amount,
      valexReferenceNumber:propertyValuationData.valexReferenceNumber,
      valexSecurityAddress: propertyValuationData.valexSecurityAddress,
      existingValexInsertMethod: propertyValuationData.existingValexInsertMethod,
      valuationFirm: propertyValuationData.valuationFirm,
      dateOfValuation: propertyValuationData.dateOfValuation ? formatDate(propertyValuationData.dateOfValuation, 'yyyy-MM-dd', 'en-AU') : null,
      valuationValidatedAmount: propertyValuationData.valuationValidatedAmount?.amount,
      variance: propertyValuationData.variance,
      securityTypeId: propertyValuationData.securityType?.id,
      securityDocumentId: propertyValuationData.securityDocument?.id,
      supportingDocument: propertyValuationData.supportingDocument?.toString(),
      contactPersonForValuation: propertyValuationData.contactPersonForValuation,
      contactNumber: propertyValuationData.contactNumber,
      valexDocument: propertyValuationData.valexDocument,
      valuationType: propertyValuationData.valuationType?.code
    }
  }
}


export class PropertyValuation {
  constructor(
    public id: string,
    public propertyValue: number,
    public valuationType: string,
    public valexReferenceNumber: string,
    public valexSecurityAddress: string,
    public valuationFirm: string,
    public dateOfValuation: any,
    public valuationValidatedAmount: number,
    public variance: number,
    public existingValexInsertMethod: string,
    public valexDocument: string,
    public securityTypeId: string,
    public securityDocumentId: string,
    public supportingDocument: string,
    public contactPersonForValuation: string,
    public contactNumber: string,
    public loanApplicationId: string
  ) {
  }
}
export class SecurityDocument{
  constructor(public id: string, public name: string) {
  }
}
export class SecurityType{
  constructor(public id: string, public name: string) {
  }
}
