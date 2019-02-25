import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { event } from '../../app/constants';

import { minEventSecretLength } from '../../global';

import { PageTrack } from '../../decorators/PageTrack';
import { EventProvider } from '../../providers/event/event';

import { EventListPage } from '../eventlist/eventlist';

@PageTrack()
@Component({
  selector: 'page-event-create',
  templateUrl: 'eventcreate.html',
})
export class EventCreatePage {

  eventForm: FormGroup;

  originalEvent: any;
  pageTitle = 'Create Event';
  submitActionTitle = 'Create';
  minPrice = event.minPrice;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public eventProvider: EventProvider,
  ) {
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.compose([Validators.required, Validators.min(this.minPrice)])],
      secret: ['', Validators.minLength(minEventSecretLength)],
      isPublic: false,
    });
  }

  async ionViewDidLoad() {
    const editId = this.navParams.get('id');

    if (editId) {
      this.originalEvent = await this.eventProvider.getEvent(editId);

      this.submitActionTitle = 'Update';
      this.pageTitle = this.originalEvent.name;

      this.eventForm.setValue({
        name: this.originalEvent.name,
        price: this.originalEvent.price,
        isPublic: this.originalEvent.isPublic,
        secret: this.originalEvent.secret || '',
      });
    }
  }

  async create() {
    try {
      await this.eventProvider.createEvent(this.eventForm.value);
      this.navCtrl.push(EventListPage);
    } catch (err) {
      console.log('create event error:', err);
    }
  }

  async update() {
    const updated = this.eventForm.value;

    try {
      this.eventProvider.updateEvent({
        info: {
          id: this.originalEvent.id,
          ...updated,
        },
      });
      this.navCtrl.pop();
    } catch (err) {
      console.log('update event error', err);
    }

  }

  async createOrUpdate() {
    if (this.originalEvent) {
      this.update();
    } else {
      this.create();
    }
  }

}
