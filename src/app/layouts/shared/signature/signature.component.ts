import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css'],
})
export class SignatureComponent implements OnInit {


  @Input()
  activeApplicantDetails!: FormGroup;

  @Input()
  signatureControlFormName !: string

  @Input()
  dateSignatureControlFormName !: string

  // signaturePadOptions: Object = {
  //   // passed through to szimek/signature_pad constructor
  //   minWidth: 5,
  //   canvasWidth: 2000,
  //   canvasHeight: 50,
  // };

  constructor() {}

  ngOnInit(): void {}

  drawComplete() {
    // this.activeApplicantDetails.get(this.signatureControlFormName)?.setValue(this.signaturePad.toDataURL())
  }
}
