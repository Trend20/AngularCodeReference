import {ApplicantPersonalInformation} from "./applicant-personal-information.model";
import {ApplicantType} from "../services/applicant-type.service";
import {NotEmployedType} from "../services/not-employed-type.service";
import {NotEmployedIncomeSource} from "../services/not-employed-income-source.service";
import {
  ApplicantAddBack,
  ApplicantIncome,
  ApplicantSupplementaryIncome, OtherJob
} from "../services/additional-personal-information.service";

export interface Applicant {
  applicantId: string;
  id: string;
  applicantTypeId: string;
  applicantType: ApplicantType;
  currentYearSuperContribution: number;
  previousYearSuperContribution: number
  estimatedAnnualSuperContribution: number;
  notEmployedTypeId: string;
  employerSuperContribution: number;
  employerSuperContributionFrequencyId: string;
  additionalSuperContribution: number;
  additionalSuperContributionFrequencyId: string;
  retiredTypeId: string;
  notEmployedIncome: number;
  notEmployedIncomeSourceId: string;
  notEmployedIncomeSource: NotEmployedIncomeSource;
  applicantPersonalInformation: ApplicantPersonalInformation;
  notEmployedType: NotEmployedType;
  selfEmployedAbnNumber: string,
  selfEmployedCompanyName: string,
  paygStartDate: any,
  employerAbn: string,
  employerName: string,
  paygTypeId: string,
  applicantIncomeList: ApplicantIncome[],
  occupationId: string,
  onProbation: string,
  probationPeriod: string,
  entityTypeId: string,
  businessActivity: string,
  businessStartDate: any,
  netProfit: number,
  abnormalExpenses: number,
  abnormalIncome: number,
  otherIncome:number,
  trustDistribution: number,
  applicantAddBackList: ApplicantAddBack[],
  applicantSupplementaryIncomeList: ApplicantSupplementaryIncome[],
  previousEmployerYearFrom: number,
  previousEmployerMonthFrom: string,
  previousEmployerYearTo: number,
  previousEmployerMonthTo: string,
  previousEmployerOccupationId: string,
  previousEmployerEmploymentTypeId: string,
  previousEmployerPaygStatusId: string,
  previousEmployerName: string,
  previousEmployerAbn: string,
  otherJobList: OtherJob[],
}
