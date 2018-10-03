import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EventProvider } from '../../providers/event/event';
import { EventListPage } from '../eventlist/eventlist';
import { minEventSecretLength } from '../../global';

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
export class EventCreatePage implements OnInit {

  eventForm : FormGroup;
  secretFieldDisabled = false;
  private secretPlaceholder = '#hello.#';

  originalEvent: any;
  pageTitle = 'Create Event';
  submitActionTitle = 'Create';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public eventProvider: EventProvider,
  ) {
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.required],
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
        isPublic: this.originalEvent.isPublic,
        secret: !this.originalEvent.isPublic?this.secretPlaceholder:'',
      });
    }
  }

  ngOnInit() {
    let field = this.eventForm.get('isPublic');
    if (field) {
      field.valueChanges.subscribe((val) => {
        this.secretFieldDisabled = val;
      });
    }
  }

  async create() {
    await this.eventProvider.createEvent(this.eventForm.value);
    this.navCtrl.push(EventListPage);
  }

  async update() {
    let updated = this.eventForm.value;
    updated = Object.assign({}, updated);

    if (updated.secret === this.secretPlaceholder) {
      updated.secret = '';
    }

    this.eventProvider.updateEvent({
      info: {
        id: this.originalEvent.id,
        ...updated,
      }
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
