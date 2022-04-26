import {PlaceAddress} from "./PlaceAddress";

export interface ApplicantPersonalInformation {
  citizenOrResident: string,
  countryOfResidence: string,
  currentResidentialStatusId: string,
  dateOfBirth: string,
  firstName: string,
  gender: string,
  applicantId: string,
  identificationType: string,
  lastName: string,
  licenseNumber: string,
  licenseStateOfIssue: string,
  maritalStatusId: string,
  middleName: string,
  otherPostalAddress: string,
  otherResidentialStatus: string,
  passportCountryOfIssue: string,
  passportNumber: string,
  postalAddress: string,
  probationPeriod: string,
  stateOfIssue: string,
  passportImage: string,
  homePhoneNumber: string,
  mobilePhoneNumber: string,
  emailAddress: string,
  addressList: PlaceAddress[],
  title: string,
  country: string,
  areaCode: string,
  dataEntryOption: string,
  notEmployedIncomeSourceId: string;
  notEmployedIncomeAmount: number;
  currentAddressFromMonth: string;
  currentAddressFromYear: number;
  previousAddressFromMonth: string;
  previousAddressFromYear: number;
  previousAddressToMonth: string;
  previousAddressToYear: number;
  numberOfDependants: number;
}
