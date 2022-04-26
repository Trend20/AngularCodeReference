import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { combineLatest, Observable, Subject } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Owner } from '../models/owner';
import { OwnershipDetails } from '../models/ownership-details';
import {Ownership} from "../../debs/services/additional-asset-liability.service";
import {ApplicantPersonalInformation} from "../../debs/models/applicant-personal-information.model";

@Component({
  selector: 'ownership-details',
  templateUrl: './ownership-details-reuseable.component.html',
  styleUrls: ['./ownership-details-reuseable.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: OwnershipDetailsReuseableComponent },
  ],
  host: {
    '[id]': 'id',
  }
})
export class OwnershipDetailsReuseableComponent implements OnInit, AfterViewInit, ControlValueAccessor, MatFormFieldControl<OwnershipDetails>, OnDestroy {

  @Input()
  memberNames !: ApplicantPersonalInformation[];
  static nextId: number = 0;
  ownershipFormGroup!: FormGroup;
  ownershipArray!: FormArray;
  ownershipPercentage: number[] = new Array(100);
  private _value: Owner[] = []
  stateChanges = new Subject<void>();
  @HostBinding('attr.aria-describedby')
  describedBy: string = '';
  private destroy: Subject<void> = new Subject();
  private touched = false;
  onChange = (_: any) => {};
  onTouched = (_: any) => {};

  @ViewChild('owners', { read: ElementRef })
  ownersRef !: ElementRef<HTMLFormElement>;

  @Input()
  get value(): OwnershipDetails | null {
    if(this.totalStake == 100 && this.ownershipFormGroup.valid) {
      return new OwnershipDetails(this._value)
    }
    return null;
  }
  set value(value: OwnershipDetails | null){
    if(value){
      this._value = value.owners;
      if (this.ownershipArray) {
        for(let i = 0; i < this.ownershipArray.length; i++) {
          let ownershipFormGroup = this.ownershipArray.at(i);
          let owner = this._value[i];
          if (owner) {
            ownershipFormGroup.get('applicantId')?.setValue(owner.applicantId);
            ownershipFormGroup.get('otherName')?.setValue(owner.otherOwner);
            ownershipFormGroup.get('ownership')?.setValue(owner.stake);
          }
        }
      }
      this.stateChanges.next();
    }
  }

  @HostBinding()
  id: string = `owner-control-${++OwnershipDetailsReuseableComponent.nextId}`;
  private _placeholder : string = '';
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  // ngControl: NgControl | null;
  _focused: boolean = false;
  @Input()
  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = value;
    this.stateChanges.next();
  }
  get empty(): boolean {
    return this._value?.length == 0
  }
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }
  private _required: boolean = false;
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled: boolean = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  get errorState(): boolean{
    return this._value.length == 0;
  }
  controlType: string = "ownership-details";
  autofilled: boolean = false;
  userAriaDescribedBy?: string | undefined;

  constructor(private focusMonitor: FocusMonitor, private elementRef: ElementRef<HTMLElement>, @Optional() @Self() public ngControl: NgControl, private autofillMonitor: AutofillMonitor, private fb: FormBuilder) {
    if (ngControl!=null) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: Ownership[]): void {
    if (obj && obj.length > 0) {
      let owners = obj.map((ownership:Ownership) => (<Owner>{applicantId: ownership?.applicantId, otherOwner: ownership.otherName, stake: ownership.percentage}));
      this.value = new OwnershipDetails(owners);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
    this.touched = true;
  }


  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.destroy.next();
    this.destroy.complete();
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    this.autofillMonitor.stopMonitoring(this.ownersRef);
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    // throw new Error('Method not implemented.');
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.focusMonitor.focusVia(this.ownersRef.nativeElement.item(), 'mouse');
    }
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.focusMonitor.monitor(this.elementRef.nativeElement, true)
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
      });
    combineLatest(
      this.observeAutofill(this.ownersRef)
    ).pipe(
      map(autofills => autofills.some(autofilled => autofilled)),
      takeUntil(this.destroy),
    ).subscribe(autofilled => this.autofilled = autofilled);
    this.updateViewValidatorsOnLoadView();
  }

  ngOnInit(): void {
    this._value.push({applicantId: null, otherOwner: null , stake: null})
    this.ownershipFormGroup = this.fb.group({
      ownershipArray: this.fb.array([this.createOwnershipDetailsFormGroup()])
    })
    this.ownershipArray = this.ownershipFormGroup.get('ownershipArray') as FormArray;
    this.ownershipFormGroup.valueChanges.subscribe(_ => {
      this.onChange(this.value);
    })
  }

  createOwnershipDetailsFormGroup(): FormGroup {
    let ownershipDetailsFormGroup: FormGroup = this.fb.group({
      applicantId: ['', Validators.required],
      otherOwner: [''],
      ownership: ['', Validators.required]
    })
    ownershipDetailsFormGroup.get('otherOwner')?.valueChanges.subscribe(newValue => {
      this.updateFormControlsOnFinancialAssetTypeChange(newValue, ownershipDetailsFormGroup);
    })
    return ownershipDetailsFormGroup;
  }
  updateFormControlsOnFinancialAssetTypeChange(reportType: string, formGroup: FormGroup){
    this.updateFormControl(reportType === 'Other', 'otherOwner', formGroup);
  }

  updateFormControl(activateRequired: Boolean = true, controlName: string, formGroup: FormGroup) {
    if (activateRequired) {
      formGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      formGroup.get(controlName)?.setValidators([]);
    }

    formGroup.setControl(controlName, <AbstractControl>formGroup.get(controlName));
    this.ownershipFormGroup.setControl('ownershipArray', this.ownershipArray);
  }

  addOwnership() {
    this.ownershipArray.push(this.createOwnershipDetailsFormGroup())
    this._value.push({applicantId: null, otherOwner: null, stake: null});
    this.ownershipFormGroup.setControl('ownershipArray', this.ownershipArray);
  }

  deleteOwnership(i: number) {
    //
    this._value.splice(i);
    this.ownershipArray.removeAt(i);
    this.ownershipFormGroup.setControl('ownershipArray', this.ownershipArray);
  }

  updateValidators() {

  }

  get validNames() : ApplicantPersonalInformation[] {
    let namesCopy: ApplicantPersonalInformation[] = [...this.memberNames];
    // loop through ownership array checking for the value of member name
    this.ownershipArray.controls.forEach((owner, index) => {
      if(namesCopy.includes(owner.get('name')?.value)){
        namesCopy.splice(index);
      }
    })
    return namesCopy;
  }

  get totalStake(): number {
    let totalMemberStake: number = 0;
    // Loop through individual stakes to get a sum
    this.ownershipArray.controls.forEach(owner => {
      let ownerStake = owner.get('ownership')?.value;
      if(isNumeric(ownerStake)){
        totalMemberStake = totalMemberStake + parseInt(<string>ownerStake);
      }
    })
    return totalMemberStake;
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }

  updateNameValueChange(i: number, ownership: AbstractControl, event: any){
    let owner: Owner = this._value[i];
    owner.applicantId = event.value;
    this.onChange(this.value);
  }

  updateOwnershipValueChange(i: number, ownership: AbstractControl, event: any){
    let owner: Owner = this._value[i];
    owner.stake = event.value;
    this.onChange(this.value);
    if(this.totalStake < 100 && (ownership as FormGroup).valid){
      this.addOwnership();
    }
  }

  handleInput(ownership: AbstractControl, i: number){
    let owner: Owner = this._value[i];
    owner.otherOwner = (ownership as FormGroup).get('otherOwner')?.value;
    this.onChange(this.value);
  }

  updateViewValidatorsOnLoadView(){
    let validators: Array<ValidatorFn> = [Validators.required];
    let formGroup: FormGroup = this.ownershipArray.get('0') as FormGroup;
    formGroup.get('applicantId')?.clearValidators();
    formGroup.get('ownership')?.clearValidators()

    formGroup.get('applicantId')?.setValidators(validators)
    formGroup.get('ownership')?.setValidators(validators)

    this.ownershipFormGroup.setControl('ownershipArray', this.ownershipArray);
  }
}
