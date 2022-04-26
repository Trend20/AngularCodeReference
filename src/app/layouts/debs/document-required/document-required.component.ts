import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CloudDocsService } from '../services/cloud-docs.service';
import { Router } from '@angular/router';

/**
 * TODO: Pathc loan id 
 *  
 * */ 
@Component({
  selector: 'app-document-required',
  templateUrl: './document-required.component.html',
  styleUrls: ['./document-required.component.css'],
})
export class DocumentRequiredComponent implements OnInit {

  loanId: string = '';

  documentsRequiredFormGroup!: FormGroup;

  docsRequired = [
    { name: 'Approval Letter', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
    { name: 'Calculator', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
    { name: 'Application form', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
    { name: 'Credit report', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
    { name: 'Applicant document', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
    { name: 'Rental Income', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
    { name: 'Valuation', url: '', documentName: '', uploadDate: '', spinnerStatus: false },
  ];

  constructor(
    private cloudDocsService: CloudDocsService,
    private formBuilder: FormBuilder, 
    private router: Router
  ) {}

  async onFileSelected(event: any, fileIndex: number) {

    console.log(this.loanId)
    
    this.docsRequired[fileIndex].spinnerStatus = true
    const file: File = event.target.files[0];

    if (file) {
      let docTitle: string = `${this.docsRequired[fileIndex].name}-${this.loanId}`;

      let docUrlBe = await this.cloudDocsService.uploadFile(
        `${this.loanId}/${this.docsRequired[fileIndex].name}`,
        file
      );

      this.docsRequired[fileIndex].spinnerStatus = false

      this.docsRequired[fileIndex].url = docUrlBe.url;
      this.docsRequired[fileIndex].documentName = docTitle;
      this.docsRequired[fileIndex].uploadDate = docUrlBe.updated;

      
    }
  }

  async onFileDelete(event: any, fileIndex: number) {

    this.docsRequired[fileIndex].spinnerStatus = true

    let path = `${this.loanId}/${this.docsRequired[fileIndex].name}`

    await this.cloudDocsService.deleteFile(path)

    this.docsRequired[fileIndex].spinnerStatus = false

    this.docsRequired[fileIndex].url = '';
    this.docsRequired[fileIndex].documentName = '';
    this.docsRequired[fileIndex].uploadDate = '';

    
  }

  ngOnInit(): void {
    let url = this.router.url.split('/');
    this.loanId =  url[url.length-1];
    this.documentsRequiredFormGroup = this.formBuilder.group({});
  }
}
