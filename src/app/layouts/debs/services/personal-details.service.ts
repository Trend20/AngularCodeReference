import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {formatDate} from "@angular/common";
import {ApplicantPersonalInformation} from "../models/applicant-personal-information.model";
import {BaseService} from "../../../services/base.service";

@Injectable({providedIn: 'root'})
export class PersonalDetailsService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  updatedDetail(personalDetail: PersonalDetails): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/personal-detail`, personalDetail, {headers: this.getHeaders()})
  }

  formatData(personalDetailData: any): PersonalDetails {
    personalDetailData.memberDetailList.forEach((memberData:any) => {
      if (memberData.address) {
        memberData.address.isCurrent = true;
      }
    });
    return {
      loanApplicationId: undefined,
      smsfAbn: {
        abn: personalDetailData.smsfAbn?.number,
        address: personalDetailData.smsfName,
        name: personalDetailData.address,
        registrationDate: personalDetailData.smsfRegistrationDate ? formatDate(personalDetailData.smsfRegistrationDate, 'yyyy-MM-dd', 'en-AU') : null
      },
      propertyTrusteeAcn: {
        acn: personalDetailData.propertyTrusteeACN?.number,
        address: personalDetailData.propertyTrustName,
        name: personalDetailData.propertyTrusteeAddress,
        registrationDate: personalDetailData.propertyTrusteeRegistrationDate ? formatDate(personalDetailData.propertyTrusteeRegistrationDate, 'yyyy-MM-dd', 'en-AU') : null,
        otherName: personalDetailData.propertyTrusteeName
      },
      smsfTrusteeAcn: {
        acn: personalDetailData.smsfTrusteeAcn?.number,
        address: personalDetailData.smsfTrusteeName,
        name: personalDetailData.smsfTrusteeAddress,
        registrationDate: personalDetailData.smsfTrusteeRegistrationDate ? formatDate(personalDetailData.smsfTrusteeRegistrationDate, 'yyyy-MM-dd', 'en-AU') : null
      },
      applicantPersonalInformationList: personalDetailData.memberDetailList.map((memberDetail: any) => ({
        firstName: memberDetail.firstName,
        middleName: memberDetail.middleName,
        lastName: memberDetail.lastName,
        dateOfBirth: formatDate(memberDetail.dateOfBirth, 'yyyy-MM-dd', 'en-AU'),
        passportCountryOfIssue: memberDetail.countryOfIssue,
        licenseStateOfIssue: memberDetail.stateOfIssue,
        passportNumber: memberDetail.passportNumber,
        licenseNumber: memberDetail.licenseNumber,
        passportImage: memberDetail.passportImage,
        homePhoneNumber: memberDetail.homePhoneNumber,
        mobilePhoneNumber: memberDetail.mobilePhoneNumber,
        emailAddress: memberDetail.emailAddress,
        addressList: [memberDetail.address],
        title: memberDetail.title,
        gender: memberDetail.gender,
        citizenOrResident: memberDetail.citizenOrResident,
        countryOfResidence: memberDetail.country,
        areaCode: memberDetail.areaCode,
        applicantId: memberDetail.applicantId,
        dataEntryOption: memberDetail.dataEntryOption
      }))
    }
  }
}


export interface PersonalDetails {
  loanApplicationId: string | undefined;
  smsfAbn: {
    abn: string;
    address: string;
    name: string;
    registrationDate: string | null
  },
  propertyTrusteeAcn: {
    acn: string
    address: string;
    name: string;
    registrationDate: string | null;
    otherName: string;
  },
  smsfTrusteeAcn: {
    acn: string
    address: string;
    name: string;
    registrationDate: string | null;
  },
  applicantPersonalInformationList: ApplicantPersonalInformation[];
}
