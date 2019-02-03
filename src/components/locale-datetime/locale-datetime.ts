import { Component, Input } from '@angular/core';

import { locale } from '../../app/constants';

@Component({
  selector: 'locale-datetime',
  templateUrl: 'locale-datetime.html',
})
export class LocaleDatetimeComponent {

  public locale = locale;
  @Input() public date: any;

  constructor() {
  }

}
