import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AssetTypeService } from './asset-type.service';
import { ExpenseTypeService } from './expense-type.service';
import { FinancialInstitutionService } from './financial-institution.service';
import { FrequencyService } from './frequency.service';
import { LoanDetailService, LoanPage } from './loan-detail.service';
import { ServiceAbilityService } from './service-ability.service';

@Injectable({
  providedIn: 'root',
})
export class DropDownServiceService {

  id: string| undefined
  constructor(
    private frequencyService: FrequencyService,
    private assetTypeService: AssetTypeService,
    private serviceAbilityService: ServiceAbilityService,
    private financialInstitutionService: FinancialInstitutionService,
    private expenseTypeService: ExpenseTypeService,
    private router: Router,
    private loanDetailService: LoanDetailService  ) {
        this.id = this.router.url.split('/')?.pop()?.split('?')[0];
    }

  public getAssetAndFrequencyList(): Observable<any> {
    let freq = this.frequencyService.getFrequencyList();
    let asse = this.assetTypeService.getAssetTypeList();
    let app =  this.loanDetailService.loanDetailJourneyfetch(LoanPage.ASSET_LIABILITY, this.id)
    let appId = this.serviceAbilityService.getCurrentLoanApplicationId();
    let fin = this.financialInstitutionService.getFinancialInstitutionList();
    let exp = this.expenseTypeService.getExpenseTypeList();
    return forkJoin([freq, asse, app, appId, fin, exp]);
  }

}
