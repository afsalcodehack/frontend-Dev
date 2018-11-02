import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../decorators/PageTrack';

@PageTrack()
@Component({
  selector: 'page-not-found',
  templateUrl: 'not-found.html',
})
export class NotFoundPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
