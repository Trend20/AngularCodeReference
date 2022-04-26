export interface GooglePlacesResponse {
  status?: string;
  info_messages?: string[];
  predictions?: GooglePrediction[];
}

export interface GooglePrediction {
    place_id: string;
  address_components: AddressComponent[];
}


interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[]
}
