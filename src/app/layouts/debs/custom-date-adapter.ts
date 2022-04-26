import { NativeDateAdapter } from "@angular/material/core";
import { Injectable } from '@angular/core';


@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  parse(value: any): Date | null {


  if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
     const str = value.split('/');
     if (str.length !== 3 || str[2].length !== 4) return null;

    const year = Number(str[2]);
    const month = Number(str[1]) - 1;
    const date = Number(str[0]);

    return new Date(year, month, date) || null;
  }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? this.invalid() : new Date(timestamp);
  }



  format(date: Date, displayFormat: Object): string {
  date = new Date(Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
    date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });

  const dtf = Intl.DateTimeFormat(this.locale, displayFormat);
  return dtf.format(date).replace(/[\u200e\u200f]/g, '');
  }

}
