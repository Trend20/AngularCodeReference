import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommonHttpResponse } from '../models/http-responses/common-response';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError<T>() {
    return (error: any): Observable<CommonHttpResponse<T>> => {
      let res: CommonHttpResponse<T> = {
        message: error.message,
        status: error.status,
      };
      return of(res as CommonHttpResponse<T>);
    };
  }

  /**
   * A generic function to make any/all http request
   * @param method Request Method
   * @param url Requst URL
   * @param options Any Options
   * @returns
   */
  makeHttpRequest(
    method: string,
    url: string,
    options?: {}
  ): Observable<CommonHttpResponse<any>> {

    return this.httpClient
      .request<CommonHttpResponse<any>>(method, url, options)
      .pipe(
        map((res) => {
          
          let newRes: CommonHttpResponse<any> = {
            message: 'success',
            status: 200,
            data: res,
          };

          return newRes;
        }),
        catchError(this.handleError<CommonHttpResponse<any>>())
      );
  }
}
