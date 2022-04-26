import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VictoriaService {

  constructor() {}

   getVictoriaStampDuty(propertyValue: number): number {
     if(propertyValue <= 25000){
        return propertyValue * 0.014;
   }
   else if(propertyValue >=25000 && propertyValue <= 130000){
     return 350 + (propertyValue - 25000) * 0.024;
   }
   else if(propertyValue >= 130000 && propertyValue <= 960000){
     return 2870 + (propertyValue -130000) * 0.06;
   }
   else{
     return propertyValue * 0.055;
   }
  }
}
