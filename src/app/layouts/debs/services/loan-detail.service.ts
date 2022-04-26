import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { PersonalDetailsUpdate, SubAccount } from '../models/sub-account.model';
import { Applicant } from '../models/applicant.model';
import { formatDate } from '@angular/common';
import { BaseService } from '../../../services/base.service';
import { HttpUtilService } from '../utils/http-util.service';
import { GetTokenService } from './get-token.service';
import { FormArray, FormGroup } from '@angular/forms';
import { Amount } from '../../shared/currency/currency.component';
import { ServiceAbilityService } from './service-ability.service';
import { PaginationData } from '../models/pagination-data.model';

@Injectable({ providedIn: 'root' })
export class LoanDetailService extends BaseService {
  loanPurposeMap = [
    { key: 'Purchase', value: 'PURCHASE' },
    { key: 'Refinance', value: 'REFINANCE' },
  ];

  loanPurposeEndpointMap: any = {
    HOME: 'loan-application',
    LOAN_DETAIL: 'loan-servicing',
    PERSONAL_DETAIL: 'personal-detail',
    ASSET_LIABILITY: 'asset-liability',
    BROKER_DECLARATION: 'broker-declaration',
    PARTNER_DECLARATION: 'business-partner',
    CLIENT_DECLARATION_GENERAL: 'client-declaration/loan',
    CLIENT_DECLARATION_APPLICANT: 'client-declaration/applicant',
  };

  mapToLoanPurposeEnum(loanPurposeString: string): string {
    return (
      this.loanPurposeMap.find((d) => d.key === loanPurposeString)?.value || ''
    );
  }

  mapToLoanPurposeString(loanPurposeEnum: string): string {
    return (
      this.loanPurposeMap.find((d) => d.value === loanPurposeEnum)?.key || ''
    );
  }

  constructor(
    private httpClient: HttpClient,
    private httpUtil: HttpUtilService,
    private getToken: GetTokenService,
    private serviceAbilityService: ServiceAbilityService
  ) {
    super();
  }

  createLoanDetail(serviceAbility: ServiceAbilityForLoanDetailPage): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/loan-detail`,
      serviceAbility,
      { headers: this.getHeaders() }
    );
  }

  updateLoanDetail(serviceAbility: ServiceAbilityForLoanDetailPage): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/loan-detail`,
      serviceAbility,
      { headers: this.getHeaders() }
    );
  }

  refinanceServiceabilityCheck(serviceability: FormGroup): Observable<any> {
    let allSubAccounts = serviceability.get('subAccounts') as FormArray;
    let loanTerm: number = 0;
    let interestOnlyTerm: number = 0;

    for (let i = 0; i < allSubAccounts?.length; i++) {
      let currentLoanTerm = allSubAccounts.at(i).get('loanTerm')?.value;
      let currentInterestOnlyPeriod = parseInt(
        allSubAccounts.at(i).get('interestOnlyPeriod')?.value
      );

      if (currentLoanTerm > loanTerm) {
        loanTerm = currentLoanTerm;
      }
      if (currentInterestOnlyPeriod > interestOnlyTerm) {
        interestOnlyTerm = currentInterestOnlyPeriod;
      }
    }

    serviceability.get('loanTerm')?.setValue(loanTerm);
    serviceability.get('interestOnlyTerm')?.setValue(interestOnlyTerm);

    let securityType: String = 'Residential';
    let loanAmount: number = parseInt(
      serviceability.get('totalLoanFromSubAccounts')?.value.amount
    );
    let securityValue: number = parseInt(
      serviceability.get('currentEstimatedLoanAmount')?.value.amount
    );
    let interestRate: number = serviceability.get('interestRate')?.value;
    let currentMonthlyLoanRepayment = 0;
    let monthlyGrossRentalIncome =
      (parseInt(
        serviceability.get('refinanceEstimatedWeeklyRent')?.value.amount
      ) *
        52) /
      12;

    let input: any = {
      SecurityType: securityType,
      LoanAmount: loanAmount,
      SecurityValue: securityValue,
      LoanTerm: loanTerm,
      InterestOnlyTerm: interestOnlyTerm,
      InterestRate: interestRate,
      CurrentMonthlyLoanRepayment: currentMonthlyLoanRepayment,
      MonthlyGrossRentalIncome: monthlyGrossRentalIncome,
    };

    this.serviceAbilityService.setCalculatorData(input);

    return this.httpUtil.makeHttpRequest(
      'POST',
      environment.refinanceCheckUrl,
      {
        body: {
          Data: {
            SecurityType: securityType,
            LoanAmount: loanAmount,
            SecurityValue: securityValue,
            LoanTerm: loanTerm,
            InterestOnlyTerm: interestOnlyTerm,
            InterestRate: interestRate,
            CurrentMonthlyLoanRepayment: currentMonthlyLoanRepayment,
            MonthlyGrossRentalIncome: monthlyGrossRentalIncome,
          },
        },
        headers: {
          Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        },
      }
    );
  }

  fullServiceabilityCheck(
    serviceability: FormGroup,
    personal: FormGroup,
    assets: FormGroup
  ) {
    let allSubAccounts = serviceability.get('subAccounts') as FormArray;
    let loanTerm: number = 0;

    for (let i = 0; i < allSubAccounts?.length; i++) {
      let currentLoanTerm = allSubAccounts.at(i).get('loanTerm')?.value;

      if (currentLoanTerm > loanTerm) {
        loanTerm = currentLoanTerm;
      }
    }

    let smsfName = personal.get('smsfName')?.value;
    let loanValue = parseInt(
      serviceability.get('totalLoanFromSubAccounts')?.value.amount
    );

    let securityValue: number = 0;

    let purpose = serviceability.get('loanPurpose')?.value;

    if (purpose == 'Refinance') {
      securityValue = (
        serviceability.get('currentEstimatedLoanAmount')?.value as Amount
      ).amount!!;
    } else {
      securityValue = (serviceability.get('purchasePrice')?.value as Amount)
        .amount!!;
    }

    let interestRate: number = serviceability.get('interestRate')?.value;
    let mandatoryContribution = 0;
    let additionalContribution = 0;

    let allMembers = serviceability.get('members') as FormArray;

    for (let i = 0; i < allMembers?.length; i++) {
      let applicantType = allMembers.at(i).get('applicantType')?.value;

      if (applicantType.name == 'PAYG') {
        let mandatory = allMembers.at(i)?.get('employerSuperContribution')
          ?.value as Amount;
        let additional = allMembers.at(i)?.get('additionalSuperContribution')
          ?.value as Amount;

        let additionalSuperContributionFrequency = allMembers
          .at(i)
          ?.get('additionalSuperContributionFrequency')?.value?.name;
        let employerSuperContributionFrequency = allMembers
          .at(i)
          ?.get('employerSuperContributionFrequency')?.value?.name;

        if (employerSuperContributionFrequency == 'Weekly') {
          mandatoryContribution += mandatory.amount!! * 52;
        } else if (employerSuperContributionFrequency == 'Fortnight') {
          mandatoryContribution += mandatory.amount!! * 26;
        } else if (employerSuperContributionFrequency == 'Monthly') {
          mandatoryContribution += mandatory.amount!! * 12;
        } else {
          mandatoryContribution += parseInt(mandatory.amount as unknown as string);
        }

        if (additionalSuperContributionFrequency == 'Weekly') {
          additionalContribution += additional.amount!! * 52;
        } else if (additionalSuperContributionFrequency == 'Fortnight') {
          additionalContribution += additional.amount!! * 26;
        } else if (additionalSuperContributionFrequency == 'Monthly') {
          additionalContribution += additional.amount!! * 12;
        } else {
          additionalContribution += parseInt(additional.amount as unknown as string);
        }
      } else if (applicantType.name == 'Self-employed') {
        let mandatory = allMembers
          .at(i)
          ?.get('estimatedAnnualSuperContribution')?.value as Amount;
        mandatoryContribution += parseInt(mandatory.amount as unknown as string);
      } else {
        let mandatory = allMembers
          .at(i)
          ?.get('notEmployedEstimatedAnnualSuperContribution')?.value as Amount;
        mandatoryContribution += parseInt(mandatory.amount as unknown as string);
      }
    }

    let totalResidentialRentalIncome = 0;

    let allResidentials = assets.get('realEstateList') as FormArray;

    for (let i = 0; i < allResidentials?.length; i++) {
      let rentAmount = allResidentials.at(i).get('rentAmount')?.value as Amount;
      let frequencyValue = allResidentials.at(i).get('rentFrequency')
        ?.value?.name;
      let annualRent = 0;

      if (frequencyValue == 'Weekly') {
        annualRent = rentAmount.amount!! * 52;
      } else if (frequencyValue == 'Fortnight') {
        annualRent = rentAmount.amount!! * 26;
      } else if (frequencyValue == 'Monthly') {
        annualRent = rentAmount.amount!! * 12;
      } else {
        annualRent = parseInt(rentAmount.amount as unknown as string);
      }

      totalResidentialRentalIncome += annualRent;
    }

    if (purpose == 'Refinance') {
      totalResidentialRentalIncome +=
        (serviceability.get('refinanceEstimatedWeeklyRent')?.value as Amount)
          .amount!! * 52;
    } else {
      totalResidentialRentalIncome +=
        (serviceability.get('estimatedWeeklyRent')?.value as Amount).amount!! *
        52;
    }

    let allAssetBalances = assets.get('financialAssetList') as FormArray;

    let cmaBalance: number = 0;
    let otherAssetBalance: number = 0;
    let totalAssetIncome: number = 0;

    for (let i = 0; i < allAssetBalances?.length; i++) {
      console.log(allAssetBalances.at(i));
      let balance = parseInt(
        (allAssetBalances.at(i).get('currentBalance')?.value as Amount)
          .amount as unknown as string
      );

      console.log(balance);
      let balanceInterest =
        allAssetBalances.at(i).get('currentInterestRatePA')?.value === null 
          ? 0
          : allAssetBalances.at(i).get('currentInterestRatePA')?.value;
      console.log(balanceInterest);

      let assetType = allAssetBalances.at(i).get('assetType')?.value?.name;

      totalAssetIncome += (balance * balanceInterest) / 100;

      if (assetType == 'Cash Management') {
        cmaBalance += balance;
      } else {
        otherAssetBalance += balance;
      }
    }

    let threePercentOfTotal = (cmaBalance + otherAssetBalance) * (3 / 100);
    let otherIncomeFromTheFund = 0;

    let purchasePrice =
      (serviceability.get('purchasePrice')?.value as Amount).amount === null
        ? 0
        : parseInt(
            (serviceability.get('purchasePrice')?.value as Amount)
              .amount as unknown as string
          );
    let stampDuty = 0;

    if (purpose != 'Refinance') {
      stampDuty =
        (serviceability.get('stampDuty')?.value as Amount).amount === null
          ? 0
          : parseInt(
              (serviceability.get('stampDuty')?.value as Amount)
                .amount as unknown as string
            );
    }

    let otherCost = parseInt(
      (serviceability.get('otherCost')?.value as Amount)
        .amount as unknown as string
    );

    let allDeposits = assets.get('depositPaidList') as FormArray;

    let loanDeposit = 0;

    for (let i = 0; i < allDeposits?.length; i++) {
      let amount = parseInt(
        (allDeposits.at(i).get('amount')?.value as Amount)
          .amount as unknown as string
      );

      loanDeposit += amount!!;
    }

    if (purpose == 'Refinance') {
      otherIncomeFromTheFund =
        threePercentOfTotal >= totalAssetIncome
          ? threePercentOfTotal
          : totalAssetIncome;
    } else {
      otherIncomeFromTheFund =
        purchasePrice!! +
        stampDuty!! +
        otherCost!! -
        loanDeposit!! -
        (cmaBalance + otherAssetBalance);

      otherIncomeFromTheFund = otherIncomeFromTheFund * (interestRate / 100);
    }

    let refinanceAmount = 0;

    let existingCommitments = [];

    let liabilities = assets.get('liabilityList') as FormArray;

    for (let i = 0; i < liabilities?.length; i++) {
      let isRefinanced = liabilities
        ?.at(i)
        ?.get('addressToBeRefinanced')?.value;

      if (isRefinanced) {
        let amount = (
          liabilities?.at(i)?.get('outstandingBalance')?.value as Amount
        ).amount;
        refinanceAmount += amount!!;
      } else {
        let propertyValue = liabilities?.at(i)?.get('propertyValue')?.value;
        let otherInvestmentLoanBalances = (
          liabilities?.at(i)?.get('outstandingBalance')?.value as Amount
        ).amount;
        let otherInvestmentLoanInterestRate = liabilities
          ?.at(i)
          ?.get('currentInterestRate')?.value;
        let monthlyRepayment = (
          liabilities?.at(i)?.get('minimumMonthlyPayment')?.value as Amount
        ).amount;

        existingCommitments.push({
          PropertyValue: propertyValue,
          OtherInvestmentLoanBalances: otherInvestmentLoanBalances,
          OtherInvestmentLoanInterestRate: otherInvestmentLoanInterestRate,
          MonthlyRepayment: monthlyRepayment,
        });
      }
    }

    let annualFundExpenses = (assets.get('totalExpenses')?.value as Amount)
      .amount!!;

    let input: any = {
      SMSFName: smsfName,
      LoanValue: loanValue,
      SecurityValue: securityValue,
      LoanTerm: loanTerm,
      InterestRate: interestRate,
      MandatoryContribution: mandatoryContribution,
      AdditionalContribution: additionalContribution,
      TotalResidentialRentalIncome: totalResidentialRentalIncome,
      CMABalance: cmaBalance,
      OtherAssetBalance: otherAssetBalance,
      OtherIncomeFromTheFund: otherIncomeFromTheFund,
      PurchasePrice: purchasePrice,
      RefinanceAmount: refinanceAmount,
      GovernmentCharges: stampDuty,
      OtherCosts: otherCost,
      DepositPaid: loanDeposit,
      AnnualFundExpenses: annualFundExpenses,
      ExistingCommitmentList: existingCommitments,
    };

    this.serviceAbilityService.setCalculatorData(input);

    return this.httpUtil.makeHttpRequest('POST', environment.smsfCheckUrl, {
      body: {
        Data: {
          SMSFName: smsfName,
          LoanValue: loanValue,
          SecurityValue: securityValue,
          LoanTerm: loanTerm,
          InterestRate: interestRate,
          MandatoryContribution: mandatoryContribution,
          AdditionalContribution: additionalContribution,
          TotalResidentialRentalIncome: totalResidentialRentalIncome,
          CMABalance: cmaBalance,
          OtherAssetBalance: otherAssetBalance,
          OtherIncomeFromTheFund: otherIncomeFromTheFund,
          PurchasePrice: purchasePrice,
          RefinanceAmount: refinanceAmount,
          GovernmentCharges: stampDuty,
          OtherCosts: otherCost,
          DepositPaid: loanDeposit,
          AnnualFundExpenses: annualFundExpenses,
          ExistingCommitmentList: existingCommitments,
        },
      },
      headers: {
        Authorization: `Bearer ${this.getToken.getAccessToken()}`,
      },
    });
  }

  /**
   * To be removed
   */
  autoPopulateUnsavedValues(serviceability: FormGroup) {
    let allSubAccounts = serviceability.get('subAccounts') as FormArray;
    let loanTerm: number = 0;
    let interestOnlyTerm: number = 0;

    for (let i = 0; i < allSubAccounts?.length; i++) {
      let currentLoanTerm = allSubAccounts.at(i).get('loanTerm')?.value;
      let currentInterestOnlyPeriod = parseInt(
        allSubAccounts.at(i).get('interestOnlyPeriod')?.value
      );

      if (currentLoanTerm > loanTerm) {
        loanTerm = currentLoanTerm;
      }
      if (currentInterestOnlyPeriod > interestOnlyTerm) {
        interestOnlyTerm = currentInterestOnlyPeriod;
      }
    }

    serviceability.get('loanTerm')?.setValue(loanTerm);
    serviceability.get('interestOnlyTerm')?.setValue(interestOnlyTerm);
  }

  formatData(loanDetailData: any): ServiceAbility {
    return {
      loanApplicationId: undefined,
      brokerId: this.getCurrentBroker().Data.BrokerId,
      loanDetail: {
        loanPurpose: this.mapToLoanPurposeEnum(loanDetailData.loanPurpose),
        requestedLoanAmount: loanDetailData.totalLoanFromSubAccounts.amount,
        loanDeposit: loanDetailData.loanDeposit.amount,
        preApproval: loanDetailData.preApproval,
        purchasePrice: loanDetailData.purchasePrice.amount,
        estimatedWeeklyRent:
          loanDetailData.loanPurpose == 'Purchase'
            ? loanDetailData.estimatedWeeklyRent.amount
            : loanDetailData.refinanceEstimatedWeeklyRent.amount,
        otherCost: loanDetailData.otherCost.amount,
        stampDuty: loanDetailData.stampDuty.amount,
        totalFunds: loanDetailData.totalFunds.amount,
        incomeContinuous: loanDetailData.isIncomeContinuous,
        loanPaidForTwoYears: loanDetailData.twoYearLoanRepayment,
        currentPropertyValue: loanDetailData.currentEstimatedLoanAmount.amount,
        loanDetailAddress: {
          ...loanDetailData.address,
          unitNumber: loanDetailData.unitNumber,
        },
        loanValueRatio: loanDetailData.loanValueRatio,
        interestRate: loanDetailData.interestRate,
      },
      subAccountList: loanDetailData.subAccounts.map((subAccount: any) => ({
        id: subAccount.id,
        loanAmount: subAccount.loanAmount.amount,
        index: subAccount.index,
        rateTypeId: subAccount.rateType.id,
        loanTerm: subAccount.loanTerm,
        loanValueRatio: subAccount.loanValueRatio,
        repaymentTypeId: subAccount.repaymentType.id,
        interestRate: subAccount.interestRate,
        fixedInterestRatePeriod: subAccount.fixedInterestRatePeriod,
        hasOffset: subAccount.offset,
        interestOnlyPeriod: subAccount.interestOnlyPeriod,
        isMainAccount: subAccount.isMainAccount,
      })),
      applicantList: loanDetailData.members.map((member: any) => ({
        id: member.id,
        applicantPersonalInformation: { firstName: member.firstName },
        retiredTypeId: member.retiredType?.id,
        applicantTypeId: member.applicantType?.id,
        notEmployedTypeId: member.notEmployedType?.id,
        paygType: member.paygType?.id,
        notEmployedEstimatedAnnualSuperContribution:
          member.notEmployedEstimatedAnnualSuperContribution?.amount,
        estimatedAnnualSuperContribution:
          member.estimatedAnnualSuperContribution?.amount,
        index: member.index,
        currentYearSuperContribution:
          member.currentYearSuperContribution?.amount,
        previousYearSuperContribution:
          member.previousYearSuperContribution?.amount,
        selfEmployedAbnNumber: member.selfEmployedAbnNumber?.number,
        selfEmployedCompanyName: member.selfEmployedCompanyName,
        additionalSuperContributionFrequencyId:
          member.additionalSuperContributionFrequency?.id,
        employerSuperContributionFrequencyId:
          member.employerSuperContributionFrequency?.id,
        employerSuperContribution: member.employerSuperContribution?.amount,
        additionalSuperContribution: member.additionalSuperContribution?.amount,
        paygStartDate: member?.paygStartDate
          ? formatDate(member.paygStartDate, 'yyyy-MM-dd', 'en-AU')
          : null,
        employerAbn: member.employerAbn?.number,
        employerName: member?.employerName,
        paygTypeId: member.paygType?.id,
      })),
    };
  }


  formatDataForLoanPage(loanDetailData: any): ServiceAbilityForLoanDetailPage {
    return {
      loanApplicationId: undefined,
      brokerId: this.getCurrentBroker().Data.BrokerId,
      loanDetail: {
        loanPurpose: this.mapToLoanPurposeEnum(loanDetailData.loanPurpose),
        requestedLoanAmount: loanDetailData.totalLoanFromSubAccounts.amount,
        loanDeposit: loanDetailData.loanDeposit.amount,
        preApproval: loanDetailData.preApproval,
        purchasePrice: loanDetailData.purchasePrice.amount,
        estimatedWeeklyRent:
          loanDetailData.loanPurpose == 'Purchase'
            ? loanDetailData.estimatedWeeklyRent.amount
            : loanDetailData.refinanceEstimatedWeeklyRent.amount,
        otherCost: loanDetailData.otherCost.amount,
        stampDuty: loanDetailData.stampDuty.amount,
        totalFunds: loanDetailData.totalFunds.amount,
        incomeContinuous: loanDetailData.isIncomeContinuous,
        loanPaidForTwoYears: loanDetailData.twoYearLoanRepayment,
        currentPropertyValue: loanDetailData.currentEstimatedLoanAmount.amount,
        loanDetailAddress: {
          ...loanDetailData.address,
          unitNumber: loanDetailData.unitNumber,
        },
        loanValueRatio: loanDetailData.loanValueRatio,
        interestRate: loanDetailData.interestRate,
      },
      subAccountList: loanDetailData.subAccounts.map((subAccount: any) => ({
        id: subAccount.id,
        loanAmount: subAccount.loanAmount.amount,
        index: subAccount.index,
        rateTypeId: subAccount.rateType.id,
        loanTerm: subAccount.loanTerm,
        loanValueRatio: subAccount.loanValueRatio,
        repaymentTypeId: subAccount.repaymentType.id,
        interestRate: subAccount.interestRate,
        fixedInterestRatePeriod: subAccount.fixedInterestRatePeriod,
        hasOffset: subAccount.offset,
        interestOnlyPeriod: subAccount.interestOnlyPeriod,
        isMainAccount: subAccount.isMainAccount,
      })),
    };
  }


  

  updateSubAccount(subAccountId: string, data: any): Observable<any> {
    console.log(data);
    return this.httpUtil.makeHttpRequest(
      'PUT',
      `${environment.baseUrl}/api/v1/sub-accounts/sub-account/${subAccountId}/update`,
      {
        body: this.formatSubAccountPayload(data),
        headers: {
          Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        },
      }
    );
  }

  createSubAccount(loanApplicationId: string, data: any): Observable<any> {
    console.log(data);
    return this.httpUtil.makeHttpRequest(
      'POST',
      `${environment.baseUrl}/api/v1/sub-accounts/sub-account/${loanApplicationId}`,
      {
        body: this.formatSubAccountPayload(data),
        headers: {
          Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        },
      }
    );
  }

  formatSubAccountPayload(data: any) {
    let subAccount: SubAccount = {
      fixedInterestRatePeriod: data['fixedInterestRatePeriod'],
      loanAmount: data['loanAmount']?.amount,
      rateTypeId: data?.rateType?.id,
      loanTerm: data['loanTerm'],
      hasOffset: data['offset'],
      repaymentTypeId: data?.repaymentType?.id,
      interestOnlyPeriod: data['interestOnlyPeriod'],
      isMainAccount: data['isMainAccount'],
      loanValueRatio: parseFloat(data['loanValueRatio']),
      interestRate: data['interestRate'],
      id: data?.id,
    };

    console.log(subAccount);

    return subAccount;
  }

  /**
   * TODO ---> create an Applicant
   * @param subAccountId
   * @param data
   * @returns
   */
  createApplicantList(loanApplicationId: string, data: any): Observable<any> {
    return this.httpUtil.makeHttpRequest(
      'POST',
      `${environment.baseUrl}/api/v1/applicants/applicant/${loanApplicationId}`,
      {
        body: this.formatPersonalDetailsPayLoad(data),
        headers: {
          Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        },
      }
    );
  }

  /**
   * Update applicant
   * @param applicantId
   * @param data
   * @returns
   */
  updateApplicantList(applicantId: string, data: any): Observable<any> {
    return this.httpUtil.makeHttpRequest(
      'PUT',
      `${environment.baseUrl}/api/v1/applicants/applicant/${applicantId}/update`,
      {
        body: this.formatPersonalDetailsPayLoad(data),
        headers: {
          Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        },
      }
    );
  }

  formatPersonalDetailsPayLoad(data: any): PersonalDetailsUpdate {
    let personalDetailsUpdate: PersonalDetailsUpdate = {
      applicantPersonalInformation: {
        firstName: data?.firstName,
      },
      estimatedAnnualSuperContribution:
        data?.estimatedAnnualSuperContribution?.amount,
      currentYearSuperContribution: data?.currentYearSuperContribution?.amount,
      previousYearSuperContribution:
        data?.previousYearSuperContribution?.amount,
      selfEmployedCompanyName: data?.selfEmployedCompanyName,
      employerSuperContribution: data?.employerSuperContribution?.amount,
      additionalSuperContribution: data?.additionalSuperContribution?.amount,
      paygStartDate: data?.paygStartDate,
      employerName: data?.employerName,
      applicantTypeId: data?.applicantType?.id,
      notEmployedTypeId: data?.notEmployedType?.id,
      employerSuperContributionFrequencyId:
        data?.employerSuperContributionFrequency?.id,
      additionalSuperContributionFrequencyId:
        data?.additionalSuperContributionFrequency?.id,
      retiredTypeId: data?.retiredType?.id,
      selfEmployedAbnNumber: data?.selfEmployedAbnNumber,
      employerAbn: data?.employerAbn?.number,
      paygTypeId: data?.paygType?.id,
      notEmployedEstimatedAnnualSuperContribution:
        data?.notEmployedEstimatedAnnualSuperContribution?.amount,
      selfEmployedBusinessStartDate: data?.selfEmployedBusinessStartDate,
    };

    return personalDetailsUpdate;
  }

  /**
   * Reusable function to fetch loan details through the jouney
   * @param loanPage
   * @param loanApplicationId
   * @param applicantId
   * @returns
   */
  loanDetailJourneyfetch(
    loanPage: LoanPage,
    loanApplicationId?: string,
    applicantId?: string,
    paginationData?: PaginationData,
    orderBy?: string,
    direction?: string,
    brokerId?: number
  ): Observable<any> {
    // size=${paginationData.pageSize}&sort=${orderBy},${direction}&page=${paginationData.currentPage}`

    let params = new HttpParams();
    if (loanApplicationId !== undefined) {
      params = params.set('loanApplicationId', loanApplicationId);
    }

    if (applicantId !== undefined) {
      params = params.set('applicantId', applicantId);
    }

    if (paginationData !== undefined) {
       params = params.set('size', paginationData.pageSize);
      params = params.set('page', paginationData.currentPage);
    }

    if (orderBy !== undefined && direction !== undefined) {
      params = params.set('sort', `${orderBy},${direction}`);
    }

    if (brokerId !== undefined) {
      params = params.set('brokerId', brokerId);
    }
 
    return this.httpUtil.makeHttpRequest(
      'GET',
      `${environment.baseUrl}/${
        this.loanPurposeEndpointMap[LoanPage[loanPage]]
      }`,
      { headers: this.getHeaders(), params: params }
    );
  }

  //Delete LoanApplication

  deleteLoanApplication(
    loanPage: LoanPage,
    loanApplicationId?: any)
    {
      let applicationId=loanApplicationId[0].loanApplicationId
  
      return this.httpUtil.makeHttpRequest(
        'DELETE',
        `${environment.baseUrl}/${this.loanPurposeEndpointMap[LoanPage[loanPage]]}/delete/${applicationId}`,
        { headers: this.getHeaders(),}
      );
   }
}

export enum LoanPage {
  HOME,
  LOAN_DETAIL,
  PERSONAL_DETAIL,
  ASSET_LIABILITY,
  BROKER_DECLARATION,
  PARTNER_DECLARATION,
  CLIENT_DECLARATION_GENERAL,
  CLIENT_DECLARATION_APPLICANT,
}

export interface LoanDetail {
  loanPurpose: string | undefined;
  currentPropertyValue: number;
  estimatedWeeklyRent: number;
  interestRate: number;
  incomeContinuous: string;
  loanPaidForTwoYears: string;
  loanDeposit: number;
  loanDetailAddress: {
    city: string;
    country: string;
    locality: string;
    postalCode: string;
    route: string;
    state: string;
    streetNumber: string;
    unitNumber: string;
  };
  loanValueRatio: number;
  otherCost: number;
  preApproval: string;
  purchasePrice: number;
  requestedLoanAmount: number;
  stampDuty: number;
  totalFunds: number;
}

export interface ServiceAbility {
  loanApplicationId: string | undefined;
  brokerId: number | undefined;
  loanDetail: LoanDetail;
  subAccountList: SubAccount[];
  applicantList: Applicant[];
}

export interface ServiceAbilityForLoanDetailPage {
  loanApplicationId: string | undefined;
  brokerId: number | undefined;
  loanDetail: LoanDetail;
  subAccountList: SubAccount[];
}
