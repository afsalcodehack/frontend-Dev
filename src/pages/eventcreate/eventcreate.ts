import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { event } from '../../app/constants';
import { EventProvider } from '../../providers/event/event';
import { EventListPage } from '../eventlist/eventlist';
import { PageTrack } from '../../decorators/PageTrack';

/**
 * Generated class for the EventcreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@PageTrack()
@Component({
  selector: 'page-event-create',
  templateUrl: 'eventcreate.html',
})
export class EventCreatePage implements OnInit {

  eventForm: FormGroup;
  private secretKey: string | null = null;

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
      secret: { value: null, disabled: true },
      isPublic: true,
    });
  }

  async ionViewDidLoad() {
    const editId = this.navParams.get('id');

    if (editId) {
      const response = await this.eventProvider.getEvent(editId);
      this.originalEvent = response['result'];
      this.secretKey = this.originalEvent.secret || null;

      this.submitActionTitle = 'Update';
      this.pageTitle = this.originalEvent.name;

      this.eventForm.setValue({
        name: this.originalEvent.name,
        price: this.originalEvent.price,
        isPublic: this.originalEvent.isPublic,
        secret: this.secretKey,
      });
    }
  }

  private generateAndAssignSecretKey() {
    this.eventProvider.getNewSecretKey().then((newKey) => {
      this.secretKey = newKey.result;
    });
  }

  ngOnInit() {
    const field = this.eventForm.get('isPublic');
    if (field) {
      field.valueChanges.subscribe((visible) => {
        if (!visible) {
          if (this.secretKey === null) {
            this.generateAndAssignSecretKey();
          }
        }
      });
    }
  }

  async create() {
    await this.eventProvider.createEvent(this.eventForm.value);
    this.navCtrl.push(EventListPage);
  }

  async update() {
    let updated = this.eventForm.value;
    updated = { ...updated, secret: this.secretKey };

    this.eventProvider.updateEvent({
      info: {
        id: this.originalEvent.id,
        ...updated,
      },
    });

    this.navCtrl.pop();
  }

  async createOrUpdate() {
    if (this.originalEvent) {
      this.update();
    } else {
      this.create();
    }
  }

}
