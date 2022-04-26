import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  message: any;
  dialogHeader !: string;

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private data: any) {
    this.message = data.message;
    this.dialogHeader = data?.header;
   }

  ngOnInit(): void {
  }

  confirm(){
    this.dialogRef.close(true);
  }

  dismiss(){
    this.dialogRef.close(null);
  }

}
