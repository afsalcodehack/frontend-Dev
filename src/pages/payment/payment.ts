import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { StripeService, Elements, Element as StripeElement, ElementsOptions, ElementOptions } from "ngx-stripe";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeProvider } from '../../providers/stripe/stripe';
import { ProductPage } from '../product/product';
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  elements: Elements;
  card: StripeElement;
  product: any;
  stripeStatus: any;
  stripeReady = false;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#2657bf', // primary color
        color: '#000',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: 'sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#999'
        }
      }
    }
  };

  paymentForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public stripeService: StripeService,
    private formBuilder: FormBuilder,
    public stripeProvider: StripeProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public languageProvider: LanguageProvider,
  ) {
    this.product = this.navParams.get('product');

    this.paymentForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async ionViewDidLoad() {
    if (!this.product) {
      return this.navCtrl.setRoot(ProductPage);
    }

    const loading = this.loadingCtrl.create({
      content: 'Preparing payment...'
    });

    loading.present();

    const locale = await this.languageProvider.getLanguage();
    const elementsOptions: ElementsOptions = { locale };

    this.stripeService.elements(elementsOptions)
    .subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', this.cardOptions);
        this.card.mount('#card-element');
        this.card.on('ready', () => {
          this.stripeReady = true;
          loading.dismiss();
        })
        this.card.on('change', status => {
          this.stripeStatus = status;
        })
      }
    });
  }

  pay() {
    const loading = this.loadingCtrl.create({
      content: 'Processing payment...'
    });

    loading.present();

    const email = this.paymentForm.get('email').value;
    this.stripeService
      .createToken(this.card, {})
      .subscribe(async result => {
        if (result.token) {
          await this.stripeProvider.charge(
            this.product.id, email, result.token.id
          );

          loading.dismiss();

          const successAlert = this.alertCtrl.create({
            title: 'Payment Success',
            subTitle: `You have purchased ${this.product.name}`,
            buttons: ['OK'],
          });

          successAlert.present();

          successAlert.onDidDismiss(() => {
            this.navCtrl.setRoot(ProductPage);
          });
        } else if (result.error) {
          // Error creating the token
          this.alertCtrl.create({
            title: 'Payment Error',
            message: result.error.message,
          }).present();
          console.error(result.error);
          loading.dismiss();
        }
      });
  }

}
