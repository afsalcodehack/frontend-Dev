import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { theme } from '../../app/constants';

@Injectable()
export class ThemeProvider {

  private theme: BehaviorSubject<string>;
  availableThemes: string[] = theme.availableThemes;

  constructor() {
    this.theme = new BehaviorSubject(this.availableThemes[0]);
  }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  getAvailableThemes() {
    return this.availableThemes;
  }
}
