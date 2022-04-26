import { Component, Inject, OnInit, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expenses } from '../../models/expenses';

@Component({
  selector: 'app-add-expense-type-dialog',
  templateUrl: './add-expense-type-dialog.component.html',
  styleUrls: ['./add-expense-type-dialog.component.css']
})
export class AddExpenseTypeDialogComponent implements OnInit {

  expenseCategory: Expenses = {
    category: '',
    description: ''
  }

  constructor(private dialogRef: MatDialogRef<AddExpenseTypeDialogComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
  }


  addCategory(form: NgForm): void {
    if(form.valid){
      this.dialogRef.close(this.expenseCategory);
    }
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

}
