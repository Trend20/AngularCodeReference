import { Component, OnInit } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, ElementRef, HostBinding, Input, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import { MatFormFieldControl } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, min, startWith, takeUntil } from 'rxjs/operators';
import { MatFormFieldControl } from '@angular/material/form-field';
import { UploadedFile } from '../models/uploaded-file';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: DragAndDropComponent },
  ],
  host: {
    '[id]': 'id',
 }
})
export class DragAndDropComponent implements OnInit, AfterViewInit, ControlValueAccessor, MatFormFieldControl<UploadedFile[]>, OnDestroy {

  private _value : UploadedFile[] = [];
  static nextId: number = 0;
  private touched = false;
  private destroy: Subject<void> = new Subject();
  @HostBinding('attr.aria-describedby')
  describedBy: string = '';
  uploadFormGroup?: FormGroup;

  @ViewChild('fileDropRef', { read: ElementRef })
  uploadRef !: ElementRef<HTMLInputElement>;

  onChange = (_: any) => {};

  @Input()
  get value() : UploadedFile[] | null{
    if(this._value?.length > 0){
      return this._value;
    }
    return null;
  }
  set value(value: UploadedFile[] | null){
    if(value){
      this._value = value;
      this.stateChanges.next();
    }
  }

  stateChanges = new Subject<void>();
  @HostBinding()
  id: string = `file-control-${++DragAndDropComponent.nextId}`;
  private _placeholder : string = '';
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  _focused: boolean = false;
  @Input()
  get focused(): boolean {
    return this._focused;
  }
  set focused(value: boolean) {
    this._focused = value;
    this.stateChanges.next();
  }
  // empty: boolean;
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
  controlType: string = 'app-drag-and-drop';
  autofilled: boolean = false;
  userAriaDescribedBy?: string | undefined;

  constructor(private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    private autofillMonitor: AutofillMonitor, private fb: FormBuilder) {
      if (ngControl!=null) {
        ngControl.valueAccessor = this;
      }
      this.uploadFormGroup = this.fb.group({
        document: [null, [Validators.required]]
      });
    }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.focusMonitor.monitor(this.elementRef.nativeElement, true)
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
      });
    combineLatest(
      this.observeAutofill(this.uploadRef)
    ).pipe(
      map(autofills => autofills.some(autofilled => autofilled)),
      takeUntil(this.destroy),
    ).subscribe(autofilled => this.autofilled = autofilled);
  }
  writeValue(obj: any): void {
    // throw new Error('Method not implemented.');
    this.value = obj;
  }
  private observeAutofill(ref: ElementRef): Observable<boolean> {
    return this.autofillMonitor.monitor(ref)
      .pipe(map(event => event.isAutofilled))
      .pipe(startWith(false));
  }
  registerOnChange(fn: any): void {
    // throw new Error('Method not implemented.');
    this.onChange = fn
  }
  onTouched(): void {
    this.touched = true;
  }
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
    this.touched = true;
  }
  
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    // throw new Error('Method not implemented.');
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.focusMonitor.focusVia(this.uploadRef.nativeElement, 'mouse');
    }
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.destroy.next();
    this.destroy.complete();
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    this.autofillMonitor.stopMonitoring(this.uploadRef);
  }

  ngOnInit(): void {
    // this.uploadFormGroup
  }

  onFileDropped($event : any) {
    this.prepareFilesList($event);
  }
  fileBrowseHandler(files : any) {
    this.prepareFilesList(files.target.files);
  }

  deleteFile(index: number) {
    this._value.splice(index, 1);
    this.onChange(this._value);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this._value.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this._value[index].file.progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this._value[index].file.progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    console.warn(JSON.stringify(files));
    for (const item of files) {
      console.log(typeof(item))
      item.progress = 0;
      this._value.push(new UploadedFile(item));
    }
    this.onChange(this._value);
    this.uploadFormGroup?.get('document')?.setValue(this._value);
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes: any, decimals : any = 0) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
