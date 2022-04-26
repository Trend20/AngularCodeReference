import { AfterViewInit, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressData } from '../models/progress-data';
import { TrackingService } from '../services/tracking.service';
import { LoanApplication } from "../../debs/models/loan-application.model";
import { LoanApplicationService } from "../../debs/services/loan-application.service";
import { PaginationData } from "../../debs/models/pagination-data.model";
import { ServiceAbilityService } from "../../debs/services/service-ability.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { LoanDetailService, LoanPage } from '../../debs/services/loan-detail.service';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.css']
})



export class InProgressComponent implements OnInit, AfterViewInit {
  isLoadingResults = true;
  orderBy: string = 'createdAt';
  orderDirection = 'DESC'
  paginationData = new PaginationData()

  displayedColumns = [
     //'id',
    // 'Application Code',
    'Application Name',
    // 'id',
    'applicationNumber',
    'loanPurpose',
    // 'Product Group',
    // 'Doc Type',
    'status',
    'createdAt',

    'updatedAt', 'Actions'];
  dataSource!: MatTableDataSource<LoanApplication>;
  
  dataSourceContainer:any=[];
  progress: ProgressData[] = [];
  sub !: Subscription;
  CURRENT_BROKER_KEY = 'current_broker';
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private router: Router, private _snackBar: MatSnackBar, private dialog: MatDialog,
    private loanDetailService: LoanDetailService,
    private trackingService: TrackingService, private loanApplicationService: LoanApplicationService, private serviceAbilityService: ServiceAbilityService, private spinner: NgxSpinnerService, private authService: AuthService) {
  }
  ngAfterViewInit(): void {
    this.trackingService.filterChanges$.subscribe(filter => {
      console.error(filter);
      this.applyFilter(filter);
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getLoanApplicationList();

  }

  recycle(data: ProgressData,index:number) {
    Swal.fire({
      title: `<p>You are about to Recyle this Inprogress aplication?

      </p>`,
      showDenyButton: true,
     
      denyButtonText: `Cancel`,
      confirmButtonText: 'Recycle',
    }).then((result) => {
    
      if (result.isConfirmed) {
        this.dataSourceContainer[0].splice(index, 1);
        this.resetAplicationList();
        Swal.fire('Recycled Succefully', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Canceled succefully', '', 'info')
      }
    })
   
  }
  edit(data: any) {

    this.serviceAbilityService.updateCurrentLoanApplicationId(data.loanApplicationId);
    // this.serviceAbilityService.updateCurrentLoanApplication(<LoanApplication>{});
    this.serviceAbilityService.updateLoanRouteAfterLoanDetailCreate(data.loanApplicationId);
    this.serviceAbilityService.setAppNumber(data.applicationNumber);

  }

  delete(data: ProgressData,index:number) {
    Swal.fire({
      title: `<p>You are about to Delete Inprogress application?

      </p>`,
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
    }).then((result) => {
         let TempData = [data];
      if (result.isConfirmed) {
       this.loanDetailService.deleteLoanApplication(LoanPage.HOME,TempData).subscribe((response)=>{

          if(response.message ==="success"){

            this.dataSourceContainer[0].splice(index, 1);
            this.resetAplicationList();
            Swal.fire('Deleted Succefully', '', 'success')
          }
       })
       
       
      } else if (result.isDenied) {
        Swal.fire('Canceled succefully', '', 'info')
      }
    })
  }

  private resetAplicationList(){
   
    this.dataSource.data = this.dataSourceContainer[0];
  }

  getLoanApplicationList() {
    // this.isLoadingResults = true;
    this.spinner.show()
    this.loanDetailService.loanDetailJourneyfetch(LoanPage.HOME, undefined, undefined, this.paginationData, this.orderBy, this.orderDirection, this.getCurrentBroker()?.Data?.BrokerId).subscribe(response => {
      this.spinner.hide()
      
      this.dataSource = new MatTableDataSource(response.data.content);
      this.dataSourceContainer.push(response.data.content);
      this.paginationData.totalElements = response.data.totalElements;
      this.paginationData.pageSize = response.data.size
    }, error => {
      this.paginationData.totalElements = 0;
      this.dataSource = new MatTableDataSource<LoanApplication>();
      // this.isLoadingResults = false;
      this.spinner.hide()
    });

  }


  sortLoanApplicationList(sort: Sort) {
    this.orderBy = sort.active;
    this.orderDirection = sort.direction;
    this.getLoanApplicationList();
  }
  pageChange(event: PageEvent) {
    this.paginationData.currentPage = event.pageIndex;
    this.paginationData.pageSize = event.pageSize;
    this.getLoanApplicationList();
  }

  getCurrentBroker(): any | undefined {
    try {
      let broker = localStorage.getItem(this.CURRENT_BROKER_KEY);
      return broker ? JSON.parse(broker) : undefined;
   } catch (error) {
    return undefined;
    }

  }

}
