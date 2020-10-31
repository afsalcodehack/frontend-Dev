import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { event } from '../../app/constants';

import { minEventSecretLength } from '../../global';

import { PageTrack } from '../../decorators/PageTrack';
import { EventProvider } from '../../providers/event/event';

import { EventListPage } from '../eventlist/eventlist';
import { TranslateService } from 'ng2-translate';

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
  message  = '';
  messageColor = 'secondary';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public eventProvider: EventProvider,
    private translate: TranslateService,
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
      this.message = '';
    } catch (err) {
      console.log(err.error.reason);
      this.translate.get(err.error.reason)
      .subscribe((translated_text) => {
        this.message = translated_text;
      });
      this.messageColor = 'danger';
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
