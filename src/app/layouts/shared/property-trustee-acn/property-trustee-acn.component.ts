import { FocusMonitor } from '@angular/cdk/a11y';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NgControl,
  FormBuilder, Validators
} from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { MatFormFieldControl } from '@angular/material/form-field';
import { isArray } from 'rxjs/internal-compatibility';
import { AbnAcnService } from '../../debs/services/abn-acn.service';
@Component({
  host: {
    '(focusout)': 'onTouched()',
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: PropertyTrusteeAcnComponent },
  ],
  selector: 'app-property-trustee-acn',
  templateUrl: './property-trustee-acn.component.html',
  styleUrls: ['./property-trustee-acn.component.css']
})
export class PropertyTrusteeAcnComponent implements AfterViewInit,
  ControlValueAccessor, MatFormFieldControl<any>,
  OnDestroy {
  static nextId: number = 0;

  private _disabled: boolean = false;
  private _focused: boolean = false;
  private _placeholder: string = '';
  private _required: boolean = false;
  private destroy: Subject<void> = new Subject();
  @Output() trusteeAcnDetails: EventEmitter<AcnSearchDetails> = new EventEmitter;

  @Output() acnErrorEmmitter: EventEmitter<{acnType: string, errorMessage: string}> = new EventEmitter<{acnType: string, errorMessage: string}>();
  @Input() acnType !: string;
  //  = false;
  acn!: FormGroup;
  loading: boolean = false;
  acnSearchDetails: AcnSearchDetails = {
    MainBusinessLocation: null,
    EntityName: null,
    GST: null,
  }

  get isValidAbnNumber(): boolean {

    if (this.acnSimilarValidator) {
      return false
     }

    return !!((String(this.acn.get('number')?.value).length == 9) && this.acnSearchDetails?.EntityName && this.acnSearchDetails?.MainBusinessLocation);

  }

  @Input()
  acnSimilarValidator: boolean = false

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
  get value(): any | null {
    const n = this.acn.get('number')?.value.number;

    if (this.acn.get('number')?.valid) {
      return n; //new Abn(n, this.abnserchDetails);
    }

    return null;
  }
  set value(value: any | null) {
    // const { abnNumber, searchDetails } = value || new Abn('', this.abnserchDetails);

    this.acn?.get('number')?.setValue(value);
    // this.abnserchDetails = searchDetails;
    this.stateChanges.next();
  }

  @HostBinding('attr.aria-describedby')
  describedBy: string = '';
  @HostBinding()
  id = `abn-number-control-${++PropertyTrusteeAcnComponent.nextId}`;
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @ViewChild('number', { read: ElementRef })
  numberRef!: ElementRef<HTMLInputElement>;

  autofilled: boolean = false;
  controlType: string = 'abn';
  get empty(): boolean {
    // const n: Abn = this.parts.value;

    return !this.acn.get('number')?.value && (!this.acnSearchDetails?.EntityName && !this.acnSearchDetails?.GST && !this.acnSearchDetails?.MainBusinessLocation );
  }
  get errorState(): boolean {
    // return (this.ngControl?.control != null)
    //   ? !!this.ngControl.control
    //   : false;

    return (this.acn?.get('number')?.invalid || true) && !this.isValidAbnNumber;
  }
  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = value;
    this.stateChanges.next();
  }
  stateChanges: Subject<void> = new Subject();

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    private autofillMonitor: AutofillMonitor,
    private fb: FormBuilder, private abnAcnService: AbnAcnService
  ) {
    if (ngControl) {
      // Set the value accessor directly (instead of providing
      // NG_VALUE_ACCESSOR) to avoid running into a circular import
      this.ngControl.valueAccessor = this;
      ngControl.valueAccessor = this;
    }
    this.acn = this.fb.group({
      number: ['', [Validators.required]]
    });
    this.acn.get('number')?.valueChanges?.subscribe(newValue => {
      let trimmedValue = newValue?.replace(/\s/g, "");
      this.acn.get('number')?.setValue(trimmedValue, {emitEvent: false});
      if(trimmedValue?.trim().length == 9){
        this.searchPropertyTrusteeACN(trimmedValue);
      } else {
        this.acnSearchDetails.EntityName = null;
        this.acnSearchDetails.GST = null;
        this.acnSearchDetails.MainBusinessLocation = null;
        this.trusteeAcnDetails.emit(this.acnSearchDetails);
      }
    })

  }
  ngOnInit(): void {
    // this.abn = this.fb.group({
    //   number: ['', [Validators.required]]
    // });
    // this.abn.get('number')?.valueChanges?.subscribe(newValue => {
    //   console.warn('on number value changed - value : ' + newValue);
    //   if(new String (newValue).length == 11){
    //     console.warn('changed value length equal to 11');
    //     // this.abn.get('number')?.disable()
    //     this.loading = true;
    //     this.abnSearch(newValue);
    //     // perform some logic
    //   } else {
    //     this.abnserchDetails.ABNId = null;
    //     this.abnserchDetails.EntityName = null;
    //     this.abnserchDetails.GST = null;
    //     this.abnserchDetails.MainBusinessLocation = null;
    //   }
    // })
  }

  searchPropertyTrusteeACN(acn: any): void {
    this.loading = true;
    this.abnAcnService.lookUpABN(acn).subscribe({
      next: response => {
        let data = response?.Data?.Data;
        if (isArray(data)) {
          if(data[0].Error){
            this.acnErrorEmmitter.emit({acnType: this.acnType, errorMessage: data[0].Error.split(']').pop()});
          }else {
            this.acnErrorEmmitter.emit({acnType: this.acnType, errorMessage: ''});
            this.acnSearchDetails.MainBusinessLocation = data[0]?.MainBusinessLocation;
          this.acnSearchDetails.EntityName = data[0]?.EntityName;
          if (data[0].GST!=='Not currently registered for GST') {
            this.acnSearchDetails.GST = data[0]?.GST?.replace('Registered from ','')?.trim();
          }
          this.trusteeAcnDetails.emit(this.acnSearchDetails);
          }
          
        }else {
          this.acnErrorEmmitter.emit({acnType: this.acnType, errorMessage: 'Failed with an unknow error'});
        }
        this.loading = false;
      }, error: err => {
        this.loading = false;
        this.acnErrorEmmitter.emit({acnType: this.acnType, errorMessage: err.toString()});
        this.trusteeAcnDetails.emit(this.acnSearchDetails)
      }
    });
  }

  ngAfterViewInit(): void {
    this.focusMonitor.monitor(this.elementRef.nativeElement, true)
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
      });
    combineLatest(
      this.observeAutofill(this.numberRef),
    ).pipe(
      map(autofills => autofills.some(autofilled => autofilled)),
      takeUntil(this.destroy),
    ).subscribe(autofilled => this.autofilled = autofilled);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    this.autofillMonitor.stopMonitoring(this.numberRef);
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.focusMonitor.focusVia(this.numberRef.nativeElement, 'mouse');
    }
  }

  onTouched(): void {

  }

  registerOnChange(onChange: (value: any | null) => void): void {
    this.acn?.valueChanges.pipe(
      takeUntil(this.destroy),
    ).subscribe(onChange);
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.acn.disable();
    } else {
      this.acn.enable();
    }

    this.disabled = shouldDisable;
  }

  writeValue(value: any): void {
    this.acn?.get('number')?.setValue(value);
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }
}


export interface AcnSearchDetails {
  MainBusinessLocation : string | null;
  EntityName: string | null;
  GST: string | null;
}
