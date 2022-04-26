import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cookie } from 'ng2-cookies';
import { BaseService } from '../services/base.service';
import { environment } from '../../environments/environment';
import { User } from './user';
import { Router } from '@angular/router';
import { ServiceAbilityService } from '../layouts/debs/services/service-ability.service';
import { BrokerData } from '../layouts/debs/models/BrokerDataModel';
import { HttpUtilService } from '../layouts/debs/utils/http-util.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  // [x: string]: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private serviceAbilityService: ServiceAbilityService, 
    private httpUtilService: HttpUtilService
  ) {
    super();
  }

  login(username: string, password: string): Observable<any> {
    const bodyParams = new FormData();
    bodyParams.set('username', username);
    bodyParams.set('password', password);
    bodyParams.set('grant_type', 'password');
    bodyParams.set('App Name', 'De Search');
    return this.httpClient.post(`${environment.searchApiAuthUrl}`, bodyParams);
  }

  verifyBroker(brokerToken: string): Observable<any> {
    const params = new HttpParams()
      .set('brokerToken', brokerToken)
      .set('accessToken', environment.verifyBrokerAccessToken);

    return this.httpClient.get(environment.verifyBrokerUrl, { params: params });
  }

  logout(): Observable<boolean> {
    Cookie.delete(this.ACCESS_TOKEN_KEY, '/');
    Cookie.delete(this.CURRENT_USER_KEY, '/');
    Cookie.delete(this.REFRESH_TOKEN_KEY, '/');
    return of(true);
  }

  autoLogin(brokerToken: string) {
    forkJoin([
      this.verifyBroker(brokerToken),
      this.login(environment.patormondUsername, environment.patormondPassword),
    ]).subscribe(
      (resList) => {
        let verifyData = resList[0];
        let loginData = resList[1];

        if (verifyData.StatusCode !== 200) {
          window.location.href = 'https://partnersdev.mezybroker.com.au/';
        } else {
          console.log(verifyData);
          // this.serviceAbilityService.setBrokerName(verifyData.Data.FullName);
          // this.serviceAbilityService.setBrokerNumber(
          //   verifyData.Data.BrokerCode
          // );
          let user = new User();
          user.id = loginData.user_uniqueid;
          user.username = loginData.user_name;
          user.name = loginData.name;
          this.setCurrentUser(user, verifyData);
          forkJoin([
            this.saveToken(loginData),
            this.saveBrokerData(verifyData.Data),
          ]).subscribe(
            (resultsList) => {

              if (resultsList[1]?.status == 200) {
                this.router.navigate(['/']);
              } else {
                console.log(resultsList[1]);
                window.location.href = 'https://partnersdev.mezybroker.com.au/';
              }
            },
            (error) => {
              console.log(error);
              window.location.href = 'https://partnersdev.mezybroker.com.au/';
            }
          );
        }
      },
      (error) => {
        window.location.href = 'https://partnersdev.mezybroker.com.au/';
        console.log(error);
      }
    );
  }

  saveBrokerData(data: any): Observable<any> {
    let brokerData: BrokerData = {
      brokerId: data.BrokerId,
      brokerCode: data.BrokerCode,
      fullName: data.FullName,
      emailAddress: data.EmailAddress,
      Username: data.Username,
      accountManagerId: data.AMId,
      accountManagerFullName: data.AMFullName,
      accountManagerEmail: data.AMEmailAddress,
      accountManagerMobile: data.AMMobileNumber,
    };
    return this.httpUtilService.makeHttpRequest(
      'POST',
      `${environment.baseUrl}/broker-details`,
      { body: brokerData }
    );
  }
}
