export class PlaceAddress {
  id: string | undefined;
  streetNumber: string | undefined;
  route: string | undefined;
  state: string | undefined;
  postalCode: string | undefined;
  country: string | undefined;
  locality: string | undefined;
  city: string | undefined;
  formattedAddress: string | undefined;
  subPremise: string | undefined;
  text: string | undefined;
  isCurrent = true;
  addressType: string | undefined;
  unitNumber: string | undefined;
  getSearchAddress(): string {
    if (this && this.subPremise) {
      return `${this.subPremise}/${this.streetNumber} ${this.route} ${this.locality}`;
    } else if (this && this.streetNumber) {
      return `${this.streetNumber} ${this.route} ${this.locality}`;
    }
    return '';
  }

  get displayAddress(): string {
    if (this.subPremise) {
      return `${this.subPremise}/${this.streetNumber} ${this.route} ${this.locality}`;
    } else if (this.streetNumber) {
      return `${this.streetNumber} ${this.route} ${this.locality}`;
    }
    return 'Hand on';
  }
}
