import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SendEmailModel } from '../models/send-email-model';
import { HttpUtilService } from '../utils/http-util.service';
import { GetTokenService } from './get-token.service';

@Injectable({
  providedIn: 'root'
})
export class EmailTriggerService {

  constructor(
    private httpUtil: HttpUtilService,
    private getToken: GetTokenService
  ) {}

  sendEmail(sendEmailModel: SendEmailModel): Observable<any> {
    return this.httpUtil.makeHttpRequest(
      'POST',
      `${environment.baseUrl}/email-record`,
      {
        body: {
          recipient: sendEmailModel.recipient,
          name: sendEmailModel.name,
          applicantId: sendEmailModel.applicantId,
          lastName: sendEmailModel.lastName,
          loanId: sendEmailModel.loanId,
          middleName: sendEmailModel.middleName,
        },
        // headers: {
        //   Authorization: `Bearer ${this.getToken.getAccessToken()}`,
        // },
      }
    );
  }


}
