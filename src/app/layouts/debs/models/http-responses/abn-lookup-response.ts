export interface ResponseDataRow<T> {
  Data: {
    Data: T[];
  };
}

export interface AbnLookupResponse {
  ABNId?: string;

  EntityName?: string;

  ABNStatus?: string;

  EntityType?: string;

  GST?: string;

  MainBusinessLocation?: string;



  ScreenshotImageURLs?: string[];

  PdfURLs?: string[];

  Error?: string;
}

export interface CoreLogicResponse {
  PropertyId: string;
  Name: string;
  Error?: string;
  ForRentJson: any[];
  LastSaleDetailsJson: any;
}

export interface RealEstateResponse {
  PropertyId: string;
  Address: string;
  PropertyPrice: number;
  Error?: string;
}
