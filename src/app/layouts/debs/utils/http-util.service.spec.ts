import { TestBed } from '@angular/core/testing';

import { HttpUtilService } from './http-util.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonHttpResponse } from '../models/http-responses/common-response';
import { AbnLookupResponse, ResponseDataRow } from '../models/http-responses/abn-lookup-response';

describe('HttpUtilService', () => {
  let service: HttpUtilService;
  let dataTest: CommonHttpResponse<ResponseDataRow<AbnLookupResponse>>;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(HttpUtilService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    
      service
        .makeHttpRequest(
          'POST',
          'https://desearchdevapi.allianceitsc.com/api/v1/TextSearch_ABNLookup/DoSearch',
          {
            body: {
              data: { ABNLookupText: 'wanjiku' },
            },
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDcyNSIsImp0aSI6ImIzYTI2MTEyLWRhNTUtNGFmZC1hZDg1LTI1NzJjNmI5YjliYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJyZ2F0aG9nbyIsImV6eV91c2VyX2lkIjoiMjA3MjUiLCJyb2xlIjoidXNlciIsImV4cCI6MTY1ODU1NzQ4MSwiaXNzIjoiNTgwNGUzZDEtMjZlMC00Y2FjLWJmYzgtMDIzYjUzNzgyNGFiIiwiYXVkIjoiZjZlZjQ1ZGMtZDkyNC00MmMwLWFkNzAtMmNkMjA4Nzk4NjliIn0.vFVSij34JmRnmpDx_UqXYq8GIZm57BvnctdqHR1Gp0U',
            },
          }
        )
        .subscribe((data: CommonHttpResponse<ResponseDataRow<AbnLookupResponse>>) => {

          dataTest = data;
         console.log(dataTest.data?.Data.Data)
        })
        
  });
});
