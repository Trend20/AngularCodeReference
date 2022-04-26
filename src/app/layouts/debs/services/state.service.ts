import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {State} from "../models/state.model";

@Injectable({providedIn: 'root'})
export class StateService {
  states = [{name: 'Queensland', code: 'QLD'},
    {name: 'South Australia', code: 'SA'},
    {name: 'Victoria', code: 'VIC'},
    {name: 'Tasmania', code: 'TAS'},
    {code: 'ACT', name: 'Australian Capital Territory'},
    {code: 'NSW', name: 'New South Wales'},
    {code: 'NT', name: 'Northern Territory'}, {name: 'Western Australia', code: 'WA'}]
  getStateCode(stateString: string): string | undefined {
    return this.states.find(state => state.code==stateString || state.name==stateString)?.code || undefined
  }
  getStateList(): Observable<State[]> {
    return of(this.states);
  }
}
