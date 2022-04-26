import {Pipe, PipeTransform} from "@angular/core";
import {LoanApplication} from "../../debs/models/loan-application.model";

@Pipe({name: 'applicationName'})
export class ApplicationNamePipe implements PipeTransform {
  transform(value: LoanApplication): string {
    return value?.applicantList.sort((a,b) => a.id.localeCompare(b.id))?.map(it => it.applicantPersonalInformation?.firstName).join(" ");
  }
}
