import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProgressData } from '../models/progress-data';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private filterSubject = new Subject<string>();
  filterChanges$ = this.filterSubject.asObservable()

  set newFilter(filter: string){
    this.filterSubject.next(filter);
  }

  constructor(private httpClient: HttpClient) { }
}

export const inProgresData: ProgressData[] = [
  {id: 1, application_code:'APP-SALPWN', application_name: 'Test', product_group: 'Standard Residential Mortgages, v1', doc_type: 'Full Doc', created_date: '20-02-2018, 11:41', last_modified: '30-08-2021, 11:53'},
  {id: 2, application_code:'APP-MF4W94', application_name: 'Test 2', product_group: 'SMSF Mortgages, v1.0.19', doc_type: 'Full Doc', created_date: '31-08-2021, 12:54', last_modified: '21-08-2021, 11:48'},
  {id: 3, application_code:'APP-SALPWN', application_name: 'Test', product_group: 'Standard Residential Mortgages, v1', doc_type: 'Full Doc', created_date: '20-02-2018, 11:41', last_modified: '21-08-2021, 11:48'}
]

export const submittedData: ProgressData[] = [
  {id: 1, application_code: 'APP-SALPWN', application_name: 'Test', status: 'Submitted', lender_reference: '61620', product_group: 'Standard Residential Mortgages, v1', doc_type: 'Lo Doc', created_date: '21-08-2021, 11:48'}
];
