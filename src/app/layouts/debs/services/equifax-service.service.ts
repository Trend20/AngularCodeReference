import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environment.prod';
import { HttpUtilService } from '../utils/http-util.service';

@Injectable({
  providedIn: 'root',
})
export class EquifaxServiceService extends BaseService {
  constructor(private httpUtil: HttpUtilService, private router: Router) {
    super();
  }

  postToEquifax(serviceability: FormGroup) {
    let loanId = this.router.url.split('/').pop();

    let requestObject: any = {
      applicants: [],
      loanApplicationId: loanId,
    };

    let members = serviceability?.value?.members;

    for (let member of members) {
      let appId = member?.id;
      let applicantType = member?.applicantType;

      let appObject: any = {
        applicantId: appId,
        applicantType: typeof applicantType === undefined ? '' : applicantType,
      };

      requestObject?.applicants?.push(appObject);
    }

    console.log(requestObject);

    return this.httpUtil.makeHttpRequest(
      'POST',
      `${environment.baseUrl}/api/v1/equifax/search`,
      {
        body: requestObject,
        headers: this.getHeaders(),
      }
    );
  }
}
