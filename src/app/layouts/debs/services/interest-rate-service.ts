import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class InterestRateService {
  getRate(loanValueRatio: number): number {
    if (loanValueRatio >= 80) {
      return 3.99
    } else if (loanValueRatio >= 70) {
      return 3.89
    } else if (loanValueRatio >= 70) {
      return 3.89
    } else if (loanValueRatio >= 65) {
      return 3.79
    }
    return 3.69
  }
}
