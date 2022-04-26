import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicantPersonalInformation } from '../models/applicant-personal-information.model';
import { User } from 'src/app/auth/user';
import { LoanApplication } from '../models/loan-application.model';
import { PlaceAddress } from '../models/PlaceAddress';
import { AddressService } from '../services/address.service';
import { ServiceAbilityService } from '../services/service-ability.service';

@Component({
  selector: 'app-reusable-top-content',
  templateUrl: './reusable-top-content.component.html',
  styleUrls: ['./reusable-top-content.component.css']
})
export class ReusableTopContentComponent implements OnInit {

  @Input() memberNames !: ApplicantPersonalInformation[];
  applicationNumber: number | undefined;
  brokerName: string | undefined;
  brokerCode: string | undefined;
  securityAddress: string | undefined;
  loanPurpose !: string;

  myjson:any=JSON;

  constructor( private router: Router, private authService: AuthService, private addressService: AddressService, private serviceAbilityService: ServiceAbilityService, private cdr: ChangeDetectorRef) { }


  goToHomepage(){
    // let id =  defKSUID32().next()
    // this.serviceAbilityService.updateCurrentLoanApplication(<LoanApplication>{});
    // this.serviceAbilityService.updateCurrentLoanApplicationId(id);
    this.router.navigate(['/home']);
  }

  

  ngOnInit(): void {

    let brokerData = this.authService.getCurrentBroker();
    this.setBrokerDetails(brokerData);
    this.serviceAbilityService.currentAppNumber.subscribe(number => {
        if (number) {
          this.applicationNumber = number;
        }
    })

    this.serviceAbilityService.currentSecurityAddress.subscribe(securityAddress => {
      if (securityAddress) {
        this.securityAddress = securityAddress;
        this.cdr.detectChanges();
      }
    })

    this.serviceAbilityService.loanPurpose.subscribe(loanPurpose => {
      if (loanPurpose) {
        this.loanPurpose = loanPurpose;
      }
    })

  }

  setBrokerDetails(brokerData : any) {

    if (brokerData !== undefined) {
        this.brokerCode = brokerData.Data.BrokerCode;
        this.brokerName = brokerData.Data.FullName;
    }else {
        this.brokerCode = '000000';
        this.brokerName = 'Anyungu Wanyungu';
    }

  }


  logout() {
    this.authService.logout().subscribe(()=>{
      window.location.href = 'https://partnersdev.mezybroker.com.au/';
    });
  }

}
