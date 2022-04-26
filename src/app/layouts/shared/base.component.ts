import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-base-ui',
  template: ''
})
export class BaseComponent {
  constructor(public toastrService: ToastrService) {
  }

  error(info: any) {
    console.log(info);
    if (parseInt(info.status, 10) === 400) {
      if (info.error && info.error.errors) {
        const errorMap = info.error.errors;
        console.dir(errorMap);
        Object.keys(errorMap.error).forEach((key) => {
          this.toastrService.error(errorMap.error[key], 'Error');
        });
      }
    } else {
      this.toastrService.error(info, 'Error');
    }
  }

  success(info: any) {
    console.log(info);
    this.toastrService.success(info, 'Success');
  }
}
