import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, HostBinding, Inject,
  Input,
  OnDestroy,
  OnInit, Optional,
  Output, Self,
  ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators} from "@angular/forms";
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from "@angular/material/form-field";
import {PlaceAddress} from "../../debs/models/PlaceAddress";
import {AddressService} from "../../debs/services/address.service";
import {combineLatest, Observable, Subject} from "rxjs";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {FocusMonitor} from "@angular/cdk/a11y";
import {map, startWith, takeUntil} from "rxjs/operators";
import {AutofillMonitor} from "@angular/cdk/text-field";

@Component({
  selector: 'app-places-auto-complete',
  templateUrl: './address-auto-complete.html',
  styleUrls: ['./address-auto-complete.css'],
  providers: [{provide: MatFormFieldControl, useExisting: AddressAutoComplete}],
  host: {
    // '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class AddressAutoComplete implements OnInit, AfterViewInit, ControlValueAccessor, MatFormFieldControl<PlaceAddress>, OnDestroy {
  addressForm: FormGroup;
  @Input()  addressType: string = 'address';
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  // @Input()
  // set placeAddress(placeAddress: PlaceAddress | null) {
  //   if (placeAddress!==null)
  //     this.addressForm.get('addressText')?.setValue(placeAddress?.formattedAddress)
  // }
  @ViewChild('addressText', {read: ElementRef})
  addressText !: ElementRef<HTMLInputElement>;
  place: any;
  stateChanges = new Subject<void>();
  focused = false;
  private destroy: Subject<void> = new Subject();
  touched = false;
  autofilled: boolean = false;
  controlType = 'address-auto-complete';
  static nextId = 0;
  id = `address-auto-complete-${AddressAutoComplete.nextId++}`;
  @HostBinding('attr.aria-describedby')
  describedBy: string = '';

  @Input()
  get placeholder(): string {
    return this._placeholder || '';
  }

  @Input()
  addressLocation !: string 

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  private _placeholder: string | undefined;
  @Input('aria-describedby') userAriaDescribedBy: string | undefined;

  @Input()
  get value(): PlaceAddress | null {
    console.log('place', this.place);
    if (this.place) {
      return this.addressService.parseAddress(this.place);
    }
    return null;
  }

  set value(placeAddress: PlaceAddress | null) {
    if (placeAddress!==null) {
      try{
        this.place = placeAddress;
        this.addressForm.get('addressText')?.setValue(this.formatAddress(placeAddress))
      }catch (e) {
        console.error(e);
      }
    }
    this.stateChanges.next();
  }

  constructor(formBuilder: FormBuilder, private addressService: AddressService, private _focusMonitor: FocusMonitor,
              private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
              @Optional() @Self() public ngControl: NgControl, private focusMonitor: FocusMonitor, private autofillMonitor: AutofillMonitor) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.addressForm = formBuilder.group({
      addressText: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
    this.focusMonitor.monitor(this._elementRef.nativeElement, true)
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
      });
    combineLatest(
      this.observeAutofill(this.addressText)
    ).pipe(
      map(autofills => autofills.some(autofilled => autofilled)),
      takeUntil(this.destroy),
    ).subscribe(autofilled => this.autofilled = autofilled);
  }

  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }
  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addressText.nativeElement,
      {
        componentRestrictions: {country: 'AU'},
        types: [this.addressType]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.place = place
    let parsedAddress = this.addressService.parseAddress(place);
    this.setAddress.emit(parsedAddress);
  }

  get empty() {
    return !this.place;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  onContainerClick(event: MouseEvent): void {
    this._focusMonitor.focusVia(this.addressText, 'program');
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }


  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this.autofillMonitor.stopMonitoring(this.addressText);
  }


  writeValue(value: PlaceAddress | null): void {
    this.value = value
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.addressForm.disable() : this.addressForm.enable();
    this.stateChanges.next();
  }

  private _disabled = false;

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.onChange(this.value);
  }

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: any) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _required = false;

  get errorState(): boolean {
    return this.addressForm.invalid && this.touched;
  }
  formatAddress(placeAddress: PlaceAddress) {
    // North Melbourne VIC 3051, Australia
    if (placeAddress== undefined) return '';

    let formatAddressValue = '';
    if (placeAddress.streetNumber) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.streetNumber} `);
    }
    if (placeAddress.route) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.route}${this.addressLocation == 'personal' ? '': ','} `);
    }
    if (placeAddress.locality) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.locality} `);
    }
    if (placeAddress.state) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.state} `);
    }
    if (placeAddress.postalCode) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.postalCode}, `);
    }
    if (placeAddress.country) {
      formatAddressValue = formatAddressValue.concat(`${placeAddress.country}`);
    }
    return formatAddressValue
  }
}
