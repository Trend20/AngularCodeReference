import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpUtilService } from '../utils/http-util.service';
import { GetTokenService } from './get-token.service';

@Injectable({
  providedIn: 'root'
})
export class ClientDeclarationService {

  constructor(
    private httpUtil: HttpUtilService,
    private getToken: GetTokenService
  ) { }


  fetchDataByApplicantId(applicantId: string) {

    return this.httpUtil.makeHttpRequest(
      'GET',
      `${environment.baseUrl}/client-declaration/${applicantId}`,
      // {
      //   body: {
      //     recipient: sendEmailModel.recipient,
      //     name: sendEmailModel.name,
      //     applicantId: sendEmailModel.applicantId
      //   },
        // headers: {
        //   Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        // },
      // }
    );

  }

  sendDataByApplicantId(applicantId: string, formGroup: FormGroup) {

   
    return this.httpUtil.makeHttpRequest(
      'POST',
      `${environment.baseUrl}/client-declaration/${applicantId}`,
      {
        body: formGroup.value,
        // headers: {
        //   Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        // },
      }
    );
  }
}
