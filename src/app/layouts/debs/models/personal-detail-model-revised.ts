import { ApplicantPersonalInformation } from './applicant-personal-information.model';
import { LoanDetailPageAddress } from './LoanDetailModelPageRevised';

export interface PersonalDetailPage {
  smsfAbn: {
    abn: string | undefined;
    address: string;
    name: string;
    registrationDate: string | undefined;
  };
  propertyTrusteeAcn: {
    acn: string | undefined;
    address: string;
    name: string;
    registrationDate: string | undefined;
    otherName: string;
  };
  smsfTrusteeAcn: {
    acn: string | undefined;
    address: string;
    name: string;
    registrationDate: string | undefined;
  };
  applicantList: ApplicantListPersonalInfromation[];
  ABNRegisteredAddressCheck: boolean;
  ACNSMSFRegisteredAddressCheck:  boolean;
  ACNPropertyRegisteredAddressCheck:  boolean;
}

export interface ApplicantListPersonalInfromation {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  passportCountryOfIssue: string;
  passportNumber: string;
  licenseNumber: string;
  licenseStateOfIssue: string;
  identificationType: string;
  citizenOrResident: string;
  gender: string;
  title: string;
  countryOfResidence: string;
  homePhoneNumber: string;
  areaCode: number;
  mobilePhoneNumber: string;
  emailAddress: string;
  dataEntryOption: number;
  addressList: LoanDetailPageAddress[]
}
