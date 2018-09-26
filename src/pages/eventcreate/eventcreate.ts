import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EventProvider } from '../../providers/event/event';
import { EventListPage } from '../eventlist/eventlist';

/**
 * Generated class for the EventcreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-create',
  templateUrl: 'eventcreate.html',
})
export class EventCreatePage {

  eventForm : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public eventProvider: EventProvider,
  ) {
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.required],
      isPublic: false,
    });
  }

  ionViewDidLoad() {
  }

  async create() {
    await this.eventProvider.createEvent(this.eventForm.value);
    this.navCtrl.push(EventListPage);
  }

}
