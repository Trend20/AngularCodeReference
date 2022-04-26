import { FocusMonitor } from '@angular/cdk/a11y';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl, ValidationErrors, ValidatorFn,
  Validators,
} from '@angular/forms';
// import { MatFormFieldControl } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, min, startWith, takeUntil } from 'rxjs/operators';
import { MatFormFieldControl } from '@angular/material/form-field';

 export class Amount{
   constructor(public amount: number | undefined) {
  }
  get currencyValue(): string {
    if(this.amount){
      return convertNumberWithCommas(this.amount?.toString())
    }
    return '';
  }
}

export function maxAmount(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors|null => {
    if (isEmptyInputValue(control.value) || max === 0) {
      return null;
    }
    const value = parseFloat(control.value?.replace(/\D/g, ''));
    return !isNaN(value) && value <= max ? null :
    {'max': {'max': max, 'actual': control.value}};
  };
}

export function minAmount(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors|null => {
    if (isEmptyInputValue(control.value) || min === 0) {
      return null;
    }
    const value = parseFloat(control.value?.replace(/\D/g, ''));
    return !isNaN(value) && value >= min ? null :
    {'min': {'min': min, 'actual': control.value}};
  };
}



@Component({
  // host: {
  //   '(focusout)': 'onTouched()',
  // },
  providers: [
    { provide: MatFormFieldControl, useExisting: CurrencyComponent },
  ],
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  host: {
     '[id]': 'id',
  }
})
export class CurrencyComponent implements AfterViewInit,
  ControlValueAccessor, MatFormFieldControl<Amount>,
  OnDestroy {
  static nextId: number = 0;

  private _disabled: boolean = false;
  private _focused: boolean = false;
  private _placeholder: string = '';
  private _required: boolean = false;
  private _readonly: boolean = false;
  private _minAmount?: number;
  private _maxAmount?: number;
  private destroy: Subject<void> = new Subject();
  private touched = false;
  currency: FormGroup;

  @Input()
  set maxAmount(value: number) {
    this._maxAmount = value;
  }

  @Input()
  set minAmount(value: number) {
    this._minAmount = value;
  }

  @Input()
  get readonly(): boolean{
    return this._readonly;
  }
  set readonly(value: boolean){
    this._readonly = value;
  }


  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  @Input()
  get value(): Amount | null {
    if (this.currency.valid) {
      const n = this.currency?.value;
      if (n.amount.length >= 2) {
        return new Amount(n.amount.trim().replace(/\D/g, ''));
      }
    }
    return new Amount(0);
  }
  set value(value: Amount | null) {
    this.currency?.get('amount')?.setValue( value?.currencyValue, { emitEvent: false});
    this.stateChanges.next();
  }

  @HostBinding('attr.aria-describedby')
  describedBy: string = '';
  @HostBinding()
  id = `currency-control-${++CurrencyComponent.nextId}`;
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @ViewChild('amount', { read: ElementRef })
  amountRef !: ElementRef<HTMLInputElement>;

  autofilled: boolean = false;
  controlType: string = 'app-currency';
  onChange = (_: any) => {};
  // onTouched = () => {};

  get empty(): boolean {
    const n: any = this.currency.value;
    let check =  n.amount
    return check?.length <= 1
  }
  get errorState(): boolean {
    // let value = ((this.currency?.value.amount + '').replace(/\D/g, '').length > 0 ? (this.currency?.value.amount + '').replace(/\D/g, '') : 0);
    let value = (convertCurrencyToNumber(this.currency?.value.amount) > 0 ? convertCurrencyToNumber(this.currency?.value.amount) : 0);
    if (this._minAmount && this._minAmount > value ) {
      return true
    }
    if (this._maxAmount && this._maxAmount < value) {
      return true
    }
    return this.currency.invalid && this.touched;
  }

  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = value;
    this.stateChanges.next();
  }
  stateChanges = new Subject<void>();

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    private autofillMonitor: AutofillMonitor,
    private fb: FormBuilder
  ) {
    if (ngControl!=null) {
      this.ngControl.valueAccessor = this;
    }
    this.currency = this.fb.group({
      amount: [null, [maxAmount((this._maxAmount == undefined) ? 0 : this._maxAmount), minAmount((this._minAmount == undefined) ? 0: this._minAmount)]]
    });

    this.currency.get('amount')?.valueChanges?.subscribe(newValue => {
      if( newValue == '$'){
        this.currency.get('amount')?.patchValue('', {emitEvent: false} );
      } else {
        let currencyValue = convertNumberWithCommas(newValue);
        this.currency.get('amount')?.patchValue(currencyValue, {emitEvent: false} );
      }
    })
  }

  ngAfterViewInit(): void {
    this.focusMonitor.monitor(this.elementRef.nativeElement, true)
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
      });
    combineLatest(
      this.observeAutofill(this.amountRef)
    ).pipe(
      map(autofills => autofills.some(autofilled => autofilled)),
      takeUntil(this.destroy),
    ).subscribe(autofilled => this.autofilled = autofilled);
    this.updateValidators();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    this.autofillMonitor.stopMonitoring(this.amountRef);
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.focusMonitor.focusVia(this.amountRef.nativeElement, 'mouse');
    }
  }

  onTouched(): void {
    this.touched = true;
  }

  registerOnChange(fn: any)  {
    this.onChange = fn
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
    this.touched = true;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.currency.disable();
    } else {
      this.currency.enable();
    }

    this.disabled = shouldDisable;
  }

  writeValue(value: Amount | null): void {
    this.value = value
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.onChange(this.value);
  }
  onKeyUp() {

  }

  updateValidators() {
    let validators: Array<ValidatorFn> = []
    if (this.required) {
      validators.push(Validators.required, maxAmount((this._maxAmount == undefined) ? 0 : this._maxAmount), minAmount((this._minAmount == undefined) ? 0: this._minAmount))
    }
    this.currency.get('amount')?.clearValidators()
    this.currency.get('amount')?.setValidators(validators);
  }
}

function isEmptyInputValue(value: any) {
  return value == undefined;
}

function convertNumberWithCommas(x: string): string {
  if(x && x !== '' && x != undefined) {
    return '$' + ((x + '').replace(/\D/g, '')).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
}

function convertCurrencyToNumber(x: string): number {

  if(x && x !== '' && x != undefined) {
    return parseFloat(x.replace(/\$|,/g, ''))
  }
  return 0;

}
