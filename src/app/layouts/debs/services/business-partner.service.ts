import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {formatDate} from "@angular/common";
import {BaseService} from "../../../services/base.service";


@Injectable({providedIn: 'root'})
export class BusinessPartnerService extends BaseService {

  constructor(private httpClient: HttpClient) {
    super();
  }

  save(businessPartner: BusinessPartner): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/business-partner`, businessPartner, {headers: this.getHeaders()});
  }

  formatData(businessPartnerData: any): BusinessPartner {
    return {
      loanApplicationId: '',
      id: businessPartnerData.id,
      clientFace: businessPartnerData.clientFace,
      sufficientEnglish: businessPartnerData.sufficientEnglish,
      financialPosition: businessPartnerData.financialPosition,
      closePersonal: businessPartnerData.closePersonal,
      closePersonalDetails: businessPartnerData.closePersonalDetails,
      existingCommitmentsDetails: businessPartnerData.existingCommitmentsDetails,
      existingCommitments: businessPartnerData.existingCommitments,
      dateOfSignature: businessPartnerData?.dateOfSignature ? formatDate(businessPartnerData.dateOfSignature, 'yyyy-MM-dd', 'en-AU') : null,
      businessPartnerName: businessPartnerData.businessPartnerName,
      loanPurposeAndBenefits: businessPartnerData.loanPurposeAndBenefits,
      refinanceReasons: businessPartnerData.refinanceReasons,
      enterLiability: businessPartnerData.enterLiability,
      exitCost: businessPartnerData.exitCost?.amount,
      clientFaceDetails: businessPartnerData.clientFaceDetails,
      sufficientEnglishDetails: businessPartnerData.sufficientEnglishDetails,
      financialPositionDetails: businessPartnerData.financialPositionDetails,
      customerBorrowingsDetails: businessPartnerData.customerBorrowingsDetails,
      exitStrategyDetails: businessPartnerData.exitStrategyDetails,
      featuresRequestedDetails: businessPartnerData.featuresRequestedDetails,
      loanProductsDetails: businessPartnerData.loanProductsDetails,
      ifConflictExistDetails: businessPartnerData.ifConflictExistDetails,
      agreeToSignDigitally: businessPartnerData.agreeToSignDigitally,
      selectPreferredSignature: businessPartnerData.selectPreferredSignature
    }
  }
}


export class BusinessPartner {
  constructor(
    public id: string,
    public clientFace: string,
    public sufficientEnglish: string,
    public financialPosition: string,
    public closePersonal: string,
    public closePersonalDetails: string,
    public existingCommitmentsDetails: string,
    public existingCommitments: string,
    public dateOfSignature: any,
    public businessPartnerName: string,
    public loanPurposeAndBenefits: string,
    public refinanceReasons: string,
    public enterLiability: string,
    public exitCost: number,
    public clientFaceDetails: string,
    public sufficientEnglishDetails: string,
    public financialPositionDetails: string,
    public customerBorrowingsDetails: string,
    public exitStrategyDetails: string,
    public featuresRequestedDetails: string,
    public loanProductsDetails: string,
    public ifConflictExistDetails: string,
    public agreeToSignDigitally: string,
    public selectPreferredSignature: string,
    public loanApplicationId: string) {
  }
}

