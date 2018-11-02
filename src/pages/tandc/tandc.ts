import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../decorators/PageTrack';

@PageTrack()
@Component({
  selector: 'page-tandc',
  templateUrl: 'tandc.html',
})
export class TandcPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TandcPage');
  }

}
