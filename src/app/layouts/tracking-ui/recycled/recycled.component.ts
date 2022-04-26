import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressData } from '../models/progress-data';
import { TrackingService, inProgresData } from '../services/tracking.service';

@Component({
  selector: 'app-recycled',
  templateUrl: './recycled.component.html',
  styleUrls: ['./recycled.component.css']
})
export class RecycledComponent implements OnInit, AfterViewInit {

  displayedColumns = ['#', 'Application Code', 'Application Name', 'Product Group', 'Doc Type', 'Created Date', 'Currently Opened', 'Last Modified', 'Actions'];
  dataSource!: MatTableDataSource<ProgressData>;
  progress: ProgressData[] = [];
  sub !: Subscription;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private router: Router, private _snackBar: MatSnackBar, private dialog: MatDialog, private trackingService: TrackingService) { 
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

  recycle(data: ProgressData){
    
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(inProgresData);
  }
}