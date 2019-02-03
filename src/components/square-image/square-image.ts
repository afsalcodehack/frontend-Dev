import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImageViewer, ImageViewerController } from 'ionic-img-viewer';

@Component({
  selector: 'square-image',
  templateUrl: 'square-image.html',
})
export class SquareImageComponent {

  @Input() photo: any;

  @ViewChild('navbarButtons') navbarButtons: TemplateRef<any>;
  @ViewChild('imageContent') imageContent: TemplateRef<any>;

  opened = false;
  viewer: ImageViewer;

  constructor(
    public imageViewerCtrl: ImageViewerController,
    public navCtrl: NavController,
  ) {}

  presentImage(image) {
    this.viewer = this.imageViewerCtrl.create(image, {
      navbarButtons: this.navbarButtons,
      imageContent: this.imageContent,
    });
    this.viewer.present().then(() => this.opened = true);
    this.viewer.onWillDismiss(() => this.opened = false);
  }

}
