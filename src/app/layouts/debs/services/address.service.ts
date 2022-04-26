import {Injectable} from "@angular/core";
import {PlaceAddress} from "../models/PlaceAddress";
import ocrMapDataJson from '../../../../assets/configs/ocr-map-data.json';

@Injectable({providedIn: 'root'})
export class AddressService {
  parseAddress(place: any): PlaceAddress {
    let components: [any] = place.address_components;
    let placeAddress = new PlaceAddress()
    if (components) {
      placeAddress.subPremise = components.find(item => item.types.indexOf('subpremise') != -1)?.long_name;
      placeAddress.streetNumber = components.find(item => item.types.indexOf('street_number') != -1)?.long_name;
      placeAddress.route = components.find(item => item.types.indexOf('route') != -1)?.long_name
      placeAddress.locality = components.find(item => item.types.indexOf('locality') != -1)?.long_name
      placeAddress.city = components.find(item => item.types.indexOf('administrative_area_level_2') != -1)?.long_name
      placeAddress.state = components.find(item => item.types.indexOf('administrative_area_level_1') != -1)?.long_name
      placeAddress.country = components.find(item => item.types.indexOf('country') != -1)?.long_name
      placeAddress.postalCode = components.find(item => item.types.indexOf('postal_code') != -1)?.long_name
      placeAddress.formattedAddress = place['formatted_address'];
      placeAddress.text = place['formatted_address'];
    }
    return placeAddress;
  }
  getSearchAddress(placeAddress: PlaceAddress | null | undefined): string {
    if (!placeAddress)
      return ''
    if (placeAddress?.subPremise) {
      return `${placeAddress.subPremise}/${placeAddress.streetNumber} ${placeAddress.route} ${placeAddress.locality}`
    } else if (placeAddress.streetNumber) {
      return `${placeAddress.streetNumber} ${placeAddress.route} ${placeAddress.locality}`
    }
    return '';
  }

  formatAddress(placeAddress: PlaceAddress) {
    // North Melbourne VIC 3051, Australia
    if (placeAddress== undefined)
      return ''
    let formatAddressValue = '';
    if (placeAddress.streetNumber) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.streetNumber} `);
    }
    if (placeAddress.route) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.route}, `);
    }
    if (placeAddress.locality) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.locality} `);
    }
    if (placeAddress.state) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.state} `);
    }
    if (placeAddress.postalCode) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.postalCode}, `);
    }
    if (placeAddress.country) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.country}`);
    }
    return formatAddressValue
  }

  /**
   * TODO: Test other address formats based on OCR API
   * @param ocrAddress 
   * @returns 
   */
  formartUploadedLicenceAddress(ocrAddress: string): PlaceAddress {
    let placeAddress: PlaceAddress = new PlaceAddress();
    if (ocrAddress !== '' && ocrAddress !== undefined || ocrAddress !== null) {

      let options:  { [key: string] : any } = ocrMapDataJson
        let addressElements = ocrAddress.replace(',', '').split(' ');
        placeAddress.streetNumber = addressElements[0];
        placeAddress.route = this.toProperCase(addressElements[1]);
        placeAddress.locality = options.localities[addressElements[2]];
        placeAddress.city = addressElements[3];
        placeAddress.state = options.states[addressElements[4]];
        placeAddress.postalCode = addressElements[5];
        placeAddress.country = 'Australia';

    }
   
    return placeAddress

  }

  private toProperCase(input: string): string {

    let charAt0 = input.charAt(0);
    let charRest = input.substring(1, input.length - 1).toLowerCase();
    return charAt0 + charRest

  }
}
