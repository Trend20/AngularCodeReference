import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasmaniaService {

  constructor() { }

  getTasmaniaStampDuty(propertyValue: number): number{

    if(propertyValue <= 3000){
      return 50;
    }
    else if(propertyValue > 3000 && propertyValue <= 25000){
      return 50 + (propertyValue - 3000) / 100 * 1.75;
    }
    else if(propertyValue > 25000 && propertyValue <= 75000){
      return 435 + (propertyValue - 25000) / 100 * 2.25;
    }
    else if(propertyValue > 75000 && propertyValue <= 200000){
      return 1560 + (propertyValue - 75000) / 100 * 3.50;

    }
    else if(propertyValue > 200000 && propertyValue <= 375000){
      return 5935 + (propertyValue - 200000) / 100 * 4.00;
    }
    else if(propertyValue > 375000 && propertyValue <= 725000){
      return 12935 + (propertyValue - 375000) / 100 * 4.25;

    }
    else{
      console.log(27810 + (propertyValue - 725000) / 100 * 4.50)
      return 27810 + (propertyValue - 725000) / 100 * 4.50;
    }
  }
}
