import { Component, Input } from '@angular/core';

import { SquareImageComponent } from '../square-image/square-image';

@Component({
  selector: 'event-square-image',
  templateUrl: 'event-square-image.html',
})
export class EventSquareImageComponent extends SquareImageComponent {

  @Input() event: any;

  async buy() {
    await this.viewer.dismiss();

    this.navCtrl.push('payment', {
      title: `${this.event.name}`,
      item: {
        type: 'image',
        id: this.photo.id,
        price: this.event.price,
        currency: this.event.currency,
      },
    });
  }

}
