import {Component, OnInit} from '@angular/core';
import {StampDutyCalculatorService} from "../services/stamp-duty-calculator.service";
import {StateService} from "../services/state.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {State} from "../models/state.model";
import {DebsDataService} from "../services/debs-data.service";

@Component({
  selector: 'app-address',
  templateUrl: './stamp-duty.component.html',
  styleUrls: ['./stamp-duty.component.css']
})
export class StampDutyComponent implements OnInit {
  address: any;
  stateList: State[] = []
  stampDuty: FormGroup;

  constructor(private stampDutyCalculatorService: StampDutyCalculatorService, private stateService: StateService, formBuilder: FormBuilder, private debsDataService: DebsDataService) {
    this.stampDuty = formBuilder.group({
      state: ['', Validators.required],
      value: ['', Validators.required],
      stampDuty: ['']
    });
    this.stampDuty.get('value')?.valueChanges.subscribe(changeValue => {
      // const newValue = this.debsDataService.convertNumberWithCommas(changeValue);
      // this.stampDuty.get('value')?.patchValue(newValue, {emitEvent: false});
      this.calculateStampDuty();
    });
    this.stampDuty.get('state')?.valueChanges.subscribe(_ => {
      this.calculateStampDuty();
    });

  }

  ngOnInit(): void {
    this.getStates();
  }

  getStates() {
    this.stateService.getStateList().subscribe(response => {
      console.log(response);
      this.stateList = response;
    });
  }

  calculateStampDuty() {
    if (this.stampDuty.valid) {
      let value = this.debsDataService.getNumber(this.stampDuty, 'value');
      console.log('value', value);
      let duty = this.stampDutyCalculatorService.calculateStateStampDuty(this.stampDuty.get('state')?.value?.code, value);
      duty = Math.round(duty);
      console.log('duty', duty);
      this.stampDuty.get('stampDuty')?.setValue(this.debsDataService.convertNumberWithCommas('' + duty));
    }
  }


}
