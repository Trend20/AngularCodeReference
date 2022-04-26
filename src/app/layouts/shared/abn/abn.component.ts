import {FocusMonitor} from '@angular/cdk/a11y';
import {AutofillMonitor} from '@angular/cdk/text-field';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
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
import {AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators} from '@angular/forms';
// import { MatFormFieldControl } from '@angular/material';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

import {MatFormFieldControl} from '@angular/material/form-field';
import {isArray} from 'rxjs/internal-compatibility';
import {AbnAcnService} from '../../debs/services/abn-acn.service';
import {DatePipe} from "@angular/common";
@Component({
  host: {
    '(focusout)': 'onTouched()',
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: AbnComponent },
  ],
  selector: 'app-abn',
  templateUrl: './abn.component.html',
  styleUrls: ['./abn.component.css']
})
export class AbnComponent implements AfterViewInit,
  ControlValueAccessor, MatFormFieldControl<any>,
  OnDestroy {
  datePipe = new DatePipe('en-AU');
  static nextId: number = 0;

  @Output() abnSearchDetailsEmitter: EventEmitter<AbnSearchDetails> = new EventEmitter;
  @Output() abnSearchErrorEmmitter: EventEmitter<string> = new EventEmitter<string>();

  private _disabled: boolean = false;
  private _focused: boolean = false;
  private _placeholder: string = '';
  private _required: boolean = false;
  private destroy: Subject<void> = new Subject();
  //  = false;
  abn!: FormGroup;
  loading: boolean = false;
  abnserchDetails: AbnSearchDetails = {
    ABNId : null,
    MainBusinessLocation: null,
    EntityName: null,
    GST: null,
    activeDate: null
  }

  get isValidAbnNumber(): boolean {
    return !!((String(this.abn.get('number')?.value).length == 11) && this.abnserchDetails?.ABNId && this.abnserchDetails?.EntityName && this.abnserchDetails?.MainBusinessLocation);
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
  get value(): any | null {
    console.log('input value', this.abn.get('number')?.value);
    const n = this.abn.get('number')?.value?.number;

    if (this.abn.get('number')?.valid) {
      return n; //new Abn(n, this.abnserchDetails);
    }

    return null;
  }
  set value(value: any | null) {
    console.log('set value', value);
    this.abn?.get('number')?.setValue(value);
    this.stateChanges.next();
  }

  @HostBinding('attr.aria-describedby')
  describedBy: string = '';
  @HostBinding()
  id = `abn-number-control-${++AbnComponent.nextId}`;
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @ViewChild('number', { read: ElementRef })
  numberRef!: ElementRef<HTMLInputElement>;

  autofilled: boolean = false;
  controlType: string = 'abn';
  onChange = (_: any) => {};
  get empty(): boolean {
    return !this.abn.get('number')?.value && (!this.abnserchDetails?.ABNId && !this.abnserchDetails?.EntityName && !this.abnserchDetails?.MainBusinessLocation );
  }
  get errorState(): boolean {
    return (this.abn?.get('number')?.invalid || true) && !this.isValidAbnNumber;
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
      this.ngControl.valueAccessor = this;
      ngControl.valueAccessor = this;
    }
    this.abn = this.fb.group({
      number: ['', [Validators.required]]
    });
    this.abn.get('number')?.valueChanges?.subscribe(newValue => {
      if(String (newValue).length == 11){
        this.loading = true;
        this.abnSearch(newValue);
      } else {
        this.abnserchDetails.ABNId = null;
        this.abnserchDetails.EntityName = null;
        this.abnserchDetails.GST = null;
        this.abnserchDetails.MainBusinessLocation = null;
        this.abnSearchDetailsEmitter.emit(this.abnserchDetails);
      }
    })

  }
  ngOnInit(): void {
  }

  abnSearch(abn:any){
    this.abnAcnService.lookUpABN(abn).subscribe({
      next: response => {
        let data = response?.Data?.Data;
        if(isArray(data)){

          if(data[0].Error) {
              this.abnSearchErrorEmmitter.emit(data[0].Error.split(']').pop());
          }else {
            this.abnSearchErrorEmmitter.emit('');
            this.abnserchDetails.MainBusinessLocation = data[0].MainBusinessLocation || null;
            if (data[0].GST!=='Not currently registered for GST') {
              this.abnserchDetails.GST = data[0].GST?.replace('Registered from ','')?.trim() || null;
            }
            try{
              if(data[0]!=='Not currently registered for GST') {
                let dateString = data[0].ABNStatus?.replace('Active from ','')?.trim();
                this.abnserchDetails.activeDate = new Date(Date.parse(dateString));
              }
            }catch (e) {}
            this.abnserchDetails.EntityName = data[0].EntityName || null;
            this.abnserchDetails.ABNId = data[0].ABNId?.substr(2,9) || null;
            this.abn.controls['number'].setErrors({'incorrect':false});
            this.abnSearchDetailsEmitter.emit(this.abnserchDetails);
          }
         
        } else {
          this.abn.controls['number'].setErrors({'incorrect':true});
          this.abnSearchErrorEmmitter.emit("Failed with an unknown error");
        }
        this.loading = false;
      }, error: err => {
        console.log(err)
        this.abnSearchErrorEmmitter.emit(err.toString());
        this.loading = false;
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
    this.abn?.valueChanges.pipe(
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
      this.abn.disable();
    } else {
      this.abn.enable();
    }

    this.disabled = shouldDisable;
  }

  writeValue(value: any): void {
    if (value) {
       this.abn?.get('number')?.setValue(value)
    }
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }
  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.onChange(this.value);
  }
}


export interface AbnSearchDetails {
  ABNId: string | null;
  MainBusinessLocation: string | null;
  EntityName: string | null;
  GST: string | null;
  activeDate: any | null;
}
