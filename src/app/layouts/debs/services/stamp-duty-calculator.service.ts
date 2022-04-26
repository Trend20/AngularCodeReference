import {Injectable} from '@angular/core';
import {TasmaniaService} from 'src/app/layouts/debs/services/tasmania/tasmania.service';
import {VictoriaService} from 'src/app/layouts/debs/services/victoria/victoria.service';
import {WesternAustraliaService} from 'src/app/layouts/debs/services/western-australia/western-australia.service';
import {AustralianCapitalTerrService} from './stamp-duty-calcs/australian-capital-terr.service';
import {NewSouthWalesService} from './stamp-duty-calcs/new-south-wales.service';
import { NorthernTerritoryService } from './stamp-duty-calcs/northern-territory.service';
import {QueenslandService} from './stamp-duty-calcs/queensland.service';
import { SouthAustraliaService } from './stamp-duty-calcs/south-australia.service';

@Injectable({
  providedIn: 'root'
})
export class StampDutyCalculatorService {

  constructor(private nswCalc: NewSouthWalesService, private qldCalc: QueenslandService, private actCalc: QueenslandService, private vicCalc: VictoriaService, private tasCalc: TasmaniaService, private waCalc: WesternAustraliaService, private ntCalc: NorthernTerritoryService, private saCalc: SouthAustraliaService) {
  }
  calculateStateStampDuty(stateCode: string, landValue: number): number {
    switch (stateCode.toLowerCase()) {
      case "nsw":
        return this.nswCalc.useStampCalculator(landValue);
      case "qld":
        return this.qldCalc.useStampCalculator(landValue);
      case "act":
        return this.actCalc.useStampCalculator(landValue);
      case "vic":
        return this.vicCalc.getVictoriaStampDuty(landValue);
      case "tas":
        return this.tasCalc.getTasmaniaStampDuty(landValue);
      case  "wa":
        return this.waCalc.getStampDuty(landValue);
      case  "nt":
        return this.ntCalc.useStampCalculator(landValue);
      case  "sa":
        return this.saCalc.useStampCalculator(landValue);
      default:
        return 0;
    }

  }
}
