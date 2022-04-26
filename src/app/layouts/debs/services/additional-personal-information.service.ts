import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ApplicantPersonalInformation} from "../models/applicant-personal-information.model";
import {formatDate} from "@angular/common";
import {BaseService} from "../../../services/base.service";

@Injectable({providedIn: 'root'})
export class AdditionalPersonalInformationService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  save(additionalPersonalInformation: AdditionalPersonalInformation): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/additional-personal-information`, additionalPersonalInformation, {headers: this.getHeaders()})
  }

  formatData(additionalPersonalInformationData: any): AdditionalPersonalInformation {
    additionalPersonalInformationData.additionalPersonalInformationMemberList.forEach((memberData:any) => {
      if (memberData.previousAddress) {
        memberData.previousAddress.isCurrent = false;
      }
    });
    return {
      loanApplicationId: '',
      additionalPersonalInformationList: additionalPersonalInformationData.additionalPersonalInformationMemberList.map((additionalPersonalInformationMember: any) => ({
        applicantId: additionalPersonalInformationMember.applicantId,
        maritalStatusId: additionalPersonalInformationMember.maritalStatus?.id,
        numberOfDependants: additionalPersonalInformationMember.numberOfDependants,
        postalAddress: additionalPersonalInformationMember.postalAddress,
        otherPostalAddress: additionalPersonalInformationMember.otherPostalAddress,
        currentResidentialStatusId: additionalPersonalInformationMember.currentResidentialStatus?.id,
        notEmployedIncomeAmount: additionalPersonalInformationMember.notEmployedIncomeAmount?.amount,
        notEmployedIncomeSourceId: additionalPersonalInformationMember.notEmployedIncomeSource?.id,
        currentAddressFromMonth: additionalPersonalInformationMember.currentAddressMonth?.name,
        currentAddressFromYear: additionalPersonalInformationMember.currentAddressYear,
        previousAddressFromYear: additionalPersonalInformationMember.previousAddressYearFrom,
        previousAddressToYear: additionalPersonalInformationMember.previousAddressYearTo,
        previousAddressFromMonth: additionalPersonalInformationMember.previousAddressMonthFrom?.name,
        previousAddressToMonth: additionalPersonalInformationMember.previousAddressMonthTo?.name,
        previousEmployerYearFrom: additionalPersonalInformationMember.previousEmployerYearFrom,
        previousEmployerMonthFrom: additionalPersonalInformationMember.previousEmployerMonthFrom?.name,
        previousEmployerYearTo: additionalPersonalInformationMember.previousAddressYearTo,
        previousEmployerMonthTo: additionalPersonalInformationMember.previousEmployerMonthTo?.name,
        previousEmployerOccupationId: additionalPersonalInformationMember.previousEmployerOccupation?.id,
        previousEmployerEmploymentTypeId: additionalPersonalInformationMember.previousEmployerEmploymentType?.id,
        previousEmployerPaygStatusId: additionalPersonalInformationMember.previousEmployerPaygStatus?.id,
        previousEmployerName: additionalPersonalInformationMember.previousEmployerName,
        previousEmployerAbn: additionalPersonalInformationMember.previousEmployerAbn?.number,
        occupationId: additionalPersonalInformationMember?.occupation?.id,
        onProbation: additionalPersonalInformationMember.onProbation,
        probationPeriod: additionalPersonalInformationMember?.probationPeriod,
        applicantIncomeList: additionalPersonalInformationMember.incomeList.map((memberIncome: any) => ({
          id: memberIncome.id,
          amount: memberIncome.amount?.amount,
          frequencyId: memberIncome?.frequency?.id,
          incomeSourceId: memberIncome.income?.id,
          workCarProvided: memberIncome.workCarProvided
        })),
        entityTypeId: additionalPersonalInformationMember.entityType?.id,
        businessActivity: additionalPersonalInformationMember.businessActivity,
        businessStartDate: additionalPersonalInformationMember.businessStartDate ? formatDate(additionalPersonalInformationMember.businessStartDate, 'yyyy-MM-dd', 'en-AU') : null,
        netProfit: additionalPersonalInformationMember.netProfit?.amount,
        abnormalExpenses: additionalPersonalInformationMember.abnormalExpenses?.amount,
        abnormalIncome: additionalPersonalInformationMember?.abnormalIncome?.amount,
        otherIncome: additionalPersonalInformationMember?.otherIncome?.amount,
        trustDistribution: additionalPersonalInformationMember?.trustDistribution?.amount,
        applicantAddBackList: additionalPersonalInformationMember.addBacksList?.map((applicantAddBack: any) => ({
          id: applicantAddBack.id,
          amount: applicantAddBack.amount?.amount,
          incomeSourceId: applicantAddBack.income?.id
        })),
        applicantSupplementaryIncomeList: additionalPersonalInformationMember.supplementaryIncomeList?.map((applicantSupplementaryIncome: any) => ({
          id: applicantSupplementaryIncome.id,
          amount: applicantSupplementaryIncome.amount?.amount,
          incomeSourceId: applicantSupplementaryIncome.income?.id
        })),
        otherJobList: additionalPersonalInformationMember.secondJobList.map((otherJob: any) => ({
          id: otherJob.id,
          employmentTypeId: otherJob.employmentType?.id,
          occupationId: otherJob.occupation?.id,
          paygStatusId: otherJob.employmentStatus?.id,
          employerName: otherJob.employerName,
          employerAbn: otherJob.employerAbn?.number,
          onProbation: otherJob.onProbation,
          probationPeriod: otherJob.probationPeriod,
          paygStartDate: otherJob.paygStartDate ? formatDate(otherJob.paygStartDate, 'yyyy-MM-dd', 'en-AU') : null,
          otherJobIncomeList: otherJob.incomeList.map((memberIncome: any) => ({
            id: memberIncome.id,
            amount: memberIncome.amount?.amount,
            frequencyId: memberIncome?.frequency?.id,
            incomeSourceId: memberIncome.income?.id,
            workCarProvided: memberIncome.workCarProvided
          })),
          previousEmployerName: otherJob.previousEmployerName,
          previousEmployerAbn: otherJob.previousEmployerAbn?.number,
          previousEmployerEmploymentTypeId: otherJob.previousEmployerEmploymentType?.id,
          previousEmployerYearFrom: otherJob.previousEmployerYearFrom,
          previousEmployerStatusId: otherJob.previousEmployerStatus?.id,
          previousEmployerMonthFrom: otherJob.previousEmployerMonthFrom?.name,
          previousEmployerYearTo: otherJob.previousEmployerYearFrom,
          previousEmployerMonthTo: otherJob.previousEmployerMonthTo?.name
        })),
        addressList: additionalPersonalInformationMember.previousAddress ? [additionalPersonalInformationMember.previousAddress] : []
      }))
    }
  }
}


export interface AdditionalPersonalInformation {
  loanApplicationId: string | undefined;
  additionalPersonalInformationList: ApplicantPersonalInformation[];
}

export class ApplicantIncome {
  constructor(
    public id: string,
    public amount: number,
    public frequencyId: string,
    public workCarProvided: string,
    public incomeSourceId: string
  ) {
  }
}

export class ApplicantAddBack {
  constructor(
    public id: string,
    public amount: number,
    public incomeSourceId: string
  ) {
  }
}

export class ApplicantSupplementaryIncome {
  constructor(
    public id: string,
    public amount: number,
    public incomeSourceId: string
  ) {
  }
}

export class OtherJob {
  constructor(public id: string, public employmentTypeId: string,
              public occupationId: string,
              public paygStatusId: string,
              public employerName: string,
              public employerAbn: string,
              public onProbation: string,
              public probationPeriod: number,
              public paygStartDate: any,
              public otherJobIncomeList: OtherJobIncome[],
              public previousEmployerName: string,
              public previousEmployerAbn: string,
              public previousEmployerEmploymentTypeId: string,
              public previousEmployerYearFrom: number,
              public previousEmployerStatusId: string,
              public previousEmployerMonthFrom: string,
              public previousEmployerYearTo: number,
              public previousEmployerMonthTo: string,
              public previousEmployerOccupationId: string) {
  }
}

export class OtherJobIncome {
  constructor(
    public id: string,
    public amount: number,
    public frequencyId: string,
    public workCarProvided: string,
    public incomeSourceId: string
  ) {
  }
}
