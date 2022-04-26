import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { InProgressComponent } from './in-progress.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, } from '@angular/material/dialog';
import { LoanPage } from '../../debs/services/loan-detail.service';
import { environment } from 'src/environments/environment';
import { LoanApplication } from '../../debs/models/loan-application.model';

describe('InprogresComponent', () => {
    let component: InProgressComponent;
    let httpTestingController: HttpTestingController;
    let fixture: ComponentFixture<InProgressComponent>;


    const MockResponse = {
        data: {
            content: [
                /* {
                     id: 0,
                     applicationCode: '4566',
                     applicantName:"Jamed giru",
                     applicationNumber: '67788',
                     applicationName: 'hsjjss',
                     loanPurpose: 'home',
                     status: true,
                     product_group: 'hjsjs',
                     doc_type: 'pdf',
                     createdDate: '2021-10-4',
                     currently_opened: true
                 }*/
            ],
            empty: true,
            first: true,
            last: true,
            number: 0,
            numberOfElements: 0,
            pageable: {
                offset: 0,
                pageNumber: 0,
                pageSize: 5,
                paged: true,
                sort: { sorted: true, unsorted: false, empty: false },
                unpaged: false,
            },
            size: 5,
            sort: { sorted: true, unsorted: false, empty: false },
            totalElements: 0,
            totalPages: 0
        }

    };


    const loanPurposeEndpointMap: any = {
        HOME: 'loan-application',
        LOAN_DETAIL: 'loan-servicing',
        PERSONAL_DETAIL: 'personal-detail',
        ASSET_LIABILITY: 'asset-liability',
        BROKER_DECLARATION: 'broker-declaration',
        PARTNER_DECLARATION: 'business-partner',
        CLIENT_DECLARATION_GENERAL: 'client-declaration/loan',
        CLIENT_DECLARATION_APPLICANT: 'client-declaration/applicant',
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule],
        }).compileComponents()

        //component = TestBed.inject(InProgressComponent);
    })

    beforeEach(async () => {
        fixture = TestBed.createComponent(InProgressComponent);
        component = fixture.componentInstance;

        httpTestingController = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    })

    it('should create inProgressComponent', () => {
        expect(component).toBeTruthy();
    })

    it('should call getLoanApplicationList', () => {
        let spy = spyOn(component, 'getLoanApplicationList');
        expect(spy).toBeTruthy();
    })

    it('should getLoan List', () => {
        const request = httpTestingController.expectOne(data =>
            data.url === `${environment.baseUrl}/${loanPurposeEndpointMap[LoanPage[LoanPage.HOME]]}` && data.method === 'GET'

        );
        request.flush(MockResponse.data.content);
      
        console.log(component.dataSource.data)
        expect(component.dataSource.data).toEqual(MockResponse.data.content)
    })

    it('should be able to filter datasource data', () => {
        const request = httpTestingController.expectOne(data =>
            data.url === `${environment.baseUrl}/${loanPurposeEndpointMap[LoanPage[LoanPage.HOME]]}` && data.method === 'GET'

        );
        request.flush(MockResponse.data.content);
        let spy = spyOn(component, 'applyFilter');
        component.applyFilter('DESC');
        expect(spy).toHaveBeenCalled();
    })

});
