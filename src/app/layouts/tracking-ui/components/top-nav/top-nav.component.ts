import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TrackingService } from '../../services/tracking.service';
import { ServiceAbilityService } from "../../../debs/services/service-ability.service";
import { LoanApplication } from "../../../debs/models/loan-application.model";
import { AuthService } from "../../../../auth/auth.service";
import { User } from "../../../../auth/user";
import { Subscription } from 'rxjs';
import { tracKingSharedService } from '../../trackingSharedService.service';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
  host: {
    '(window:resize)': 'onResize($event)',
    '(window:load)': 'onLoadResize()'
  }
  // encapsulation: ViewEncapsulation.Emulated
})

export class TopNavComponent implements OnInit {

  public pushRightClass: string = '';
  filter: string = '';
  currentUser: User | undefined;
  brokerCode: string | undefined;
  brokerName: string | undefined;
  element: HTMLElement | undefined;
  username: string | undefined;
  showBars: boolean | undefined;

  createEventSubscription: Subscription | undefined;
  constructor(private router: Router, private trackingService: TrackingService, private serviceAbilityService: ServiceAbilityService,
    private authService: AuthService, private sharedService: tracKingSharedService) {
    this.createEventSubscription = this.sharedService.getClickEvent().subscribe((data) => {
      if (data === 'log') {
        this.logout();
      }
      if (data === 'createNew') {
        this.onCreateNew();
      }
      if (data === 'openBars') {
        this.openBarFromSideBarClick();
      }
    })
  }

  private eventsSubscription: Subscription | undefined;

  @Input() buttonTrigger: boolean | undefined;
  buttonToggle: boolean = false;
  private setDynamicWidth(width: number, element: HTMLElement) {
    let wraper = document.getElementById('wraper') as HTMLElement;
    let section = document.getElementById('section') as HTMLElement;
    let sidebar = document.getElementById('sidebar') as HTMLElement;
    let container = document.getElementById('container') as HTMLElement;

    if (width < 990) {
      element.style.width = "50%";
      this.showBars = true;
      section.style.width = "100%";
      wraper.style.width = "0%";
      section.style.position = "relative";
      container.style.width = width + "px";
    }
    else {
      this.showBars = false;
      element.style.width = '20%'
      section.style.width = "80%";
      wraper.style.position = "fixed";
      sidebar.style.display = "block";
      wraper.style.width = "20%";
      container.style.width = "100%";
    }
  }
  onLoadResize() {
    this.element = document.getElementById('myDiv') as HTMLElement;
    let windowWidth = window.innerWidth;
    this.setDynamicWidth(windowWidth, this.element);
  }

  onResize(event: any) {
    this.element = document.getElementById('myDiv') as HTMLElement;
    let windowWidth = event.target.innerWidth
    this.setDynamicWidth(windowWidth, this.element);

  }

  openSideNav() {
    this.showBars = false;
    this.sharedService.sendClickEvent('openSideNav');
  }

  openBarFromSideBarClick() {
    this.showBars = true;
  }


  ngOnInit(): void {
    this.setDynamicWidth(window.innerWidth, document.getElementById('myDiv') as HTMLElement);
    this.currentUser = this.authService.getCurrentUser();
    let brokerData = this.authService.getCurrentBroker();
    this.username = this.authService.getCurrentUser()?.username;
    this.setBrokerDetails(brokerData);



  }

  onCreateNew() {

    this.serviceAbilityService.updateCurrentLoanApplication(<LoanApplication>{});

    this.serviceAbilityService.setAppNumber(null);
    this.serviceAbilityService.setLoanSecurityAddress('');
    this.serviceAbilityService.updateLoanPurpose('');
    this.router.navigate(['/smsf', 'add-edit']);
  }

  applyFilter() {
    console.log(this.filter);
    this.trackingService.newFilter = this.filter;
  }


  setBrokerDetails(brokerData: any) {

    if (brokerData !== undefined) {
      this.brokerCode = brokerData.Data.BrokerCode;
      this.brokerName = brokerData.Data.FullName;
    } else {
      this.brokerCode = '000000';
      this.brokerName = 'Anyungu Wanyungu';
    }

  }


  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = 'https://partnersdev.mezybroker.com.au/';
    });
  }

}
