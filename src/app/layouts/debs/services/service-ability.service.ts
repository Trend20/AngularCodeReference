import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { PlaceAddress } from '../models/PlaceAddress';
import { LoanApplication } from '../models/loan-application.model';
import { Router } from '@angular/router';
import { LoanDetailPage } from '../models/LoanDetailModelPageRevised';
import { PersonalDetailPage } from '../models/personal-detail-model-revised';
import { BrokerDeclarationPage, BusinessPartnerPage } from '../models/declaration-model-revised';
import { ClientDeclaration } from '../models/client-declaration';
import { AssetAndLiabilitiesPage } from '../models/asset-and-liability-model-revised';
import { Amount } from '../../shared/currency/currency.component';

@Injectable({
  providedIn: 'root',
})
export class ServiceAbilityService {

  constructor(private router: Router) { }


  private _currentLoanApplicationId = new BehaviorSubject<string>('');
  private _currentLoanApplication = new BehaviorSubject<LoanApplication>(
    <LoanApplication>{}
  );
  private applicationNumber = new BehaviorSubject<any>('');
  private brokerNumber = new BehaviorSubject<any>('');
  private brokerName = new BehaviorSubject<any>('');
  private calculatorData = new BehaviorSubject<any>(null);
  private calculatorResult = new BehaviorSubject<any>(null);
  private securityAddress = new BehaviorSubject<any>('');
  private securityValue = new BehaviorSubject<any>('');
  currentAppNumber = this.applicationNumber.asObservable();
  currentCalculatorData = this.calculatorData.asObservable();
  currentCalculatorResult = this.calculatorResult.asObservable();
  currentBrokerNumber = this.brokerNumber.asObservable();
  currentBrokerName = this.brokerName.asObservable();
  currentSecurityAddress = this.securityAddress.asObservable();
  currentSecurityValue = this.securityValue.asObservable();

  /**
   * Data store for the global loan detail page data
   */
  private _loanDetailPage = new BehaviorSubject<LoanDetailPage>(<LoanDetailPage> {});
  private _personalDetailPage = new BehaviorSubject<PersonalDetailPage>(<PersonalDetailPage> {});
  private _businessPartnerPage = new BehaviorSubject<BusinessPartnerPage>(<BusinessPartnerPage> {});
  private _clientDetailPage = new BehaviorSubject<ClientDeclaration>(<ClientDeclaration>{});
  private _brokerDetailPage = new BehaviorSubject<BrokerDeclarationPage>(<BrokerDeclarationPage>{});
  private _assetLiabilityPage = new BehaviorSubject<AssetAndLiabilitiesPage>(<AssetAndLiabilitiesPage>{});

  setLoanSecurityAddress(loan: string) {
    this.securityAddress.next(loan);
  }

  setAppNumber(message: any) {
  this.applicationNumber.next(message)
  }
  setCalculatorData(data: any){
    this.calculatorData.next(data)
  }

  setCalculatorResult(result: any){
    this.calculatorResult.next(result)
  }

  setBrokerNumber(number: any) {
    this.brokerNumber.next(number)
  }

  setBrokerName(name: any){
    this.brokerName.next(name)
  }

  setSecurityValue(amount: Amount){
    console.log(amount)
    this.securityValue.next(amount)
  }

  currentLoanApplicationId = this._currentLoanApplicationId.asObservable();
  currentLoanApplication = this._currentLoanApplication.asObservable();
  private _loanPurpose = new BehaviorSubject('');
  loanPurpose = this._loanPurpose.asObservable();
  private _propertyAddress = new BehaviorSubject(new PlaceAddress());
  propertyAddress = this._propertyAddress.asObservable();

  /**
   * Show or hide the serviceability page 
   */
  private _showloanDetail = true;

  refinanceStatus = new BehaviorSubject(true);

  nextMessage(placeAddress: PlaceAddress) {
    this._propertyAddress.next(placeAddress);
  }
  updateLoanPurpose(loanPurpose: string) {
    this._loanPurpose.next(loanPurpose);
  }

  private _deleteMemberSubject: Subject<number> = new Subject<number>();
  private _addMemberSubject: Subject<string> = new Subject<string>();
  deletedMember = this._deleteMemberSubject.asObservable();
  addedMember = this._addMemberSubject.asObservable();
  deleteMember(index: number) {
    this._deleteMemberSubject.next(index);
  }

  addMember(applicantId: string) {
    this._addMemberSubject.next(applicantId);
  }
  updateCurrentLoanApplicationId(loanApplicationId: string) {
    this._currentLoanApplicationId.next(loanApplicationId);
  }
  updateCurrentLoanApplication(loanApplication: LoanApplication) {
    this._currentLoanApplication.next(loanApplication);
  }

  updateRefinanceStatus(status: boolean) {
    this.refinanceStatus.next(status);
  }

  getCurrentLoanApplication(): Observable<any> {
    return of(this._currentLoanApplication)
  }

  getCurrentLoanApplicationId (): Observable<any>{
    return of(this._currentLoanApplicationId)
  }

  updateLoanRouteAfterLoanDetailCreate(id: string) {
    this.updateCurrentLoanApplicationId(id);
    console.info("updateLoanRouteAfterLoanDetailCreate id= ",id)
    this.setShowOrHideSewrviceabilityPage(false);
    this.router.navigate(['/smsf','add-edit',id]);
  }

  setShowOrHideSewrviceabilityPage(show: boolean) {
     console.log('setShowOrHideSewrviceabilityPage', show)
      this._showloanDetail = show;
  }

  getShowServiceabilityPage() {
    console.log(this._showloanDetail)
    return  this._showloanDetail
  }

  /**Get and set LoanDetails page Model */

   getCurrentLoanDetailPageData (): Observable<any> {
    return this._loanDetailPage.asObservable();
  }

  setCurrentLoanDetailPageData (data: LoanDetailPage) {
      this._loanDetailPage.next(data)
  }

  /**Get and set PersonalDetails page Model */

  getCurrentPersonalDetailPageData (): Observable<any> {
    return this._personalDetailPage.asObservable();
  }

  setCurrentPersonalDetailPageData (data: PersonalDetailPage) {
      this._personalDetailPage.next(data)
  }

  /**Get and set BusinessPartner page Model */

  getCurrentBusinessPartnerPageData (): Observable<any> {
    return this._businessPartnerPage.asObservable();
  }

  setCurrentBusinessPartnerPageData (data: BusinessPartnerPage) {
      this._businessPartnerPage.next(data)
  }

  /**Get and set Client Declaration page Model */

  getCurrentClientDeclarationPageData (): Observable<any> {
    return this._clientDetailPage.asObservable();
  }

  setCurrentClientDeclarationPageData (data: ClientDeclaration) {
      this._clientDetailPage.next(data)
  }

  /**Get and set Broker Declaration page Model */

  getCurrentBrokerDeclarationPageData (): Observable<any> {
    return this._brokerDetailPage.asObservable();
  }

  setCurrentBrokerDeclarationPageData (data: BrokerDeclarationPage) {
      this._brokerDetailPage.next(data)
  }

  /**Get and set AssetLiability page Model */

  getCurrentAssetLiabilityPageData (): Observable<any> {
    return this._assetLiabilityPage.asObservable();
  }

  setCurrentAssetLiabilityPageData (data: AssetAndLiabilitiesPage) {
      this._assetLiabilityPage.next(data)
  }
  
}
