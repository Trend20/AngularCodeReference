import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError } from 'rxjs';
import {environment} from 'src/environments/environment';
import {ApiLoginResp} from '../../shared/models/api-login-resp';
import {tap, catchError} from 'rxjs/operators';
import {OcrResponse} from '../models/ocr-response';
import {HttpUtilService} from '../utils/http-util.service';
import {GetTokenService} from './get-token.service';
import {PlaceAddress} from "../models/PlaceAddress";
import {RealEstate} from "../models/real-estate.model";
import {CoreLogicData} from "../models/core-logic-data.model";
import {FormGroup} from "@angular/forms";
import {isNumeric} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class DebsDataService {

  // credentials object holds the token, after it's set any component injecting this service has access to it. Remove if redundant
  private _credentials !: ApiLoginResp;

  get credentials(): ApiLoginResp {
    return this._credentials;
  }

  baseUrl = "http://localhost:3000/"

  constructor(private http: HttpClient, private httpUtil: HttpUtilService, private getToken: GetTokenService) {
  }

  private _address !: PlaceAddress | null | undefined;
  private _loanPurpose !: string | null | undefined;

  get address(): PlaceAddress | null | undefined {
    return this._address;
  }

  set address(value: PlaceAddress | null | undefined) {
    this._address = value;
  }

  get loanPurpose(): string | null | undefined {
    return this._loanPurpose;
  }

  set loanPurpose(value: string | null | undefined) {
    this._loanPurpose = value;
  }


  //
  coreLogicSearch(search: string): Observable<any> {

    return this.httpUtil
      .makeHttpRequest('POST', environment.coreLogicUrl,
        {
          body: {
            "data": {
              "Name": search,
              "SearchBy": ""
            }
          },
          headers: {
            Authorization:
              `Bearer ${this.getToken.getAccessToken()}`,
          },
        }
      )
  }


  postCodeCheck(searchCode: string = ''): Observable<any> {

    return this.httpUtil
      .makeHttpRequest('POST', environment.postCodeCheckUrl,
        {
          body: {
              "PostcodeCheck": searchCode,
              "CategoryPostcodeParentId": "13,12,11,10"
          },
          headers: {
            Authorization:
              `Bearer ${this.getToken.getAccessToken()}`,
          },
        }
      )
  }
  searchApiLogin(): Observable<ApiLoginResp> {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post<ApiLoginResp>(environment.searchApiAuthUrl, this.getApiCredentialsPayload(), {headers: headers})
      .pipe(tap(data => {
        this._credentials = data;
      }), catchError(this.handleError));
  }

  searchOCR(formData: FormData): Observable<OcrResponse> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.credentials.access_token});
    return this.http.post<OcrResponse>(environment.ocrSearchUrl, formData, {
      headers: headers
    })
        .pipe(tap(data => console.log(JSON.stringify(data))), catchError(this.handleError));
  }

  convertNumberWithCommas(x: string): string {
    // return '$' + ((x + '').replace(/\D/g, '')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if(x && x !== '' ) {
      return '$' + ((x + '').replace(/\D/g, '')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '';
  }

  convertCurrencyToNumber(x: string): number {


    const y = x.replace(/\$|,/g, '')


    return parseFloat(y);

  }

  getApiCredentialsPayload(): string {
    return `Username=${environment.searchApiUsername}&Password=${atob(environment.searchApiPassword)}&Grant_type=password&App_name=De+Search`;
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    }

    console.error(errorMessage);
    return throwError(err);
  }

  realEstateSearch(search: string): Observable<any> {
    return this.http.post(environment.realEstateUrl, {data: {TextSearch: search}}, {headers: {Authorization: `Bearer ${this.getToken.getAccessToken()}`}})
  }

  parseRealEstate(data: any): RealEstate {
    let realEstate = new RealEstate()
    realEstate.address = data.Data?.Data[0]?.Address
    realEstate.bathRooms = data.Data?.Data[0]?.BathRooms
    realEstate.beds = data.Data?.Data[0]?.Beds
    realEstate.getInTouch_AgencyJson = data.Data?.Data[0]?.GetInTouch_AgencyJson
    realEstate.landSize = data.Data?.Data[0]?.LandSize
    realEstate.parkingCars = data.Data?.Data[0]?.ParkingCars
    realEstate.propertyId = data.Data?.Data[0]?.PropertyId
    realEstate.propertyPrice = data.Data?.Data[0]?.PropertyPrice
    realEstate.propertyType = data.Data?.Data[0]?.PropertyType
    return realEstate
  }
  parseCoreLogicData(data: any): CoreLogicData {
    let coreLogicData = new CoreLogicData()
    console.log(data.Data)
    console.log(data.Data?.[0]?.ForRentJson?.[0]?.LastListedPrice);
    if (parseInt(data.StatusCode)==200) {
      if (data.Data?.[0]?.ForRentJson?.[0]?.LastListedPrice?.toString()?.includes('week')){
        coreLogicData.rentFrequency = 'Weekly'
      }
      coreLogicData.price = data.Data[0]?.EstimatedInfomation?.EstimatedValue || 0
      coreLogicData.rentAmount = data.Data[0]?.EstimatedInfomation?.EstimatedRent_PerWeek || ''
    }
    return coreLogicData;
  }
  getNumber(formGroup: FormGroup, formControlName: string): number {
    let controleValue = formGroup.get(formControlName)?.value;
    let value = (controleValue + '').replace(/\D/g, '');
    if (value && isNumeric(value)) {
      return parseFloat(`${value}`)
    } else return 0
  }
}
