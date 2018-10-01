import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImageViewerController, ImageViewer } from 'ionic-img-viewer';
import { PaymentPage } from '../../pages/payment/payment';


@Component({
  selector: 'square-image',
  templateUrl: 'square-image.html',
})
export class SquareImageComponent {

  @Input() photo: any;
  @Input() event: any;

  @ViewChild('navbarButtons') navbarButtons: TemplateRef<any>;

  opened = false;
  viewer: ImageViewer;

  constructor(
    public imageViewerCtrl: ImageViewerController,
    public navCtrl: NavController,
  ) {}

  presentImage(image) {
    this.viewer = this.imageViewerCtrl.create(image, {
      navbarButtons: this.navbarButtons,
    });
    this.viewer.present();
  }

  async buy() {
    await this.viewer.dismiss();

    this.navCtrl.push(PaymentPage, {
      title: `a photo from ${this.event.name}`,
      item: {
        type: 'image',
        id: this.photo.url,
        price: this.event.price,
        currency: this.event.currency
      },
    });
  }

}
