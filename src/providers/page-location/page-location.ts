import { Injectable } from '@angular/core';

import { hashLocationPrefix } from '../../global';

@Injectable()
export class PageLocationProvider {

  location(page_id) {
    return hashLocationPrefix + page_id;
  }

}
