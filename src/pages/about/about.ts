import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageTrack } from '../../decorators/PageTrack';

@PageTrack()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

}
