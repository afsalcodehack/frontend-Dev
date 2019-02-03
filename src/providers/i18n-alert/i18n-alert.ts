import { Injectable } from '@angular/core';
import { Alert, AlertButton, AlertController, AlertOptions } from 'ionic-angular';
import { AlertInputOptions } from 'ionic-angular/components/alert/alert-options';
import { TranslateService } from 'ng2-translate';

interface InterpolationMap {
  [key: string]: any;
}

interface I18nAlertInterpolationMap {
  title?: InterpolationMap;
  subTitle?: InterpolationMap;
  message?: InterpolationMap;
}

@Injectable()
export class I18nAlertProvider {

  constructor(public translate: TranslateService,
              private alertCtrl: AlertController) {
  }

  public translator(str: string, interpolationMap?: InterpolationMap): Promise<string> {
    return this.translate.get(str, interpolationMap).toPromise();
  }

  private translateAlertButton(button: string | AlertButton): Promise<string | AlertButton> {
    if (typeof button !== 'object') {
      return this.translator(button);
    }

    if (button.text) {
      return this.translator(button.text)
        .then((translated) => button.text = translated)
        .then(() => button);
    }

    return Promise.resolve(button);
  }

  private async translateAlertInput(alertInputOptions: AlertInputOptions): Promise<AlertInputOptions> {
    if (alertInputOptions.label) {
      alertInputOptions.label = await this.translator(alertInputOptions.label);
    }

    if (alertInputOptions.placeholder) {
      alertInputOptions.placeholder = await this.translator(alertInputOptions.placeholder);
    }

    return alertInputOptions;
  }

  public toStandardAlertTitle(str: string): string {
    const shouldNotTerminateWith = ['.', '?', '!'];

    const lastChar = str.trim().substr(-1);
    const found = shouldNotTerminateWith.findIndex((char) => {
      return lastChar === char;
    });

    if (found !== -1) {
      str = str.substring(0, str.length - 2);
    }

    return str;
  }

  public toStandardAlertMessage(str: string): string {
    const allowedTerminatingChars = ['.', '?'];
    const defaultTerminatingChar = '.';

    const lastChar = str.trim().substr(-1);
    const found = allowedTerminatingChars.findIndex((char) => {
      return lastChar === char;
    });

    if (found === -1) {
      str += defaultTerminatingChar;
    }

    return str;
  }

  public async create(opts: AlertOptions, alertInterpolationMap?: I18nAlertInterpolationMap): Promise<Alert> {
    if (opts.title) {
      const interpolationMap = alertInterpolationMap ? alertInterpolationMap.title : {};
      opts.title = await this.translator(opts.title, interpolationMap);
      opts.title = this.toStandardAlertTitle(opts.title);
    }

    if (opts.message) {
      const interpolationMap = alertInterpolationMap ? alertInterpolationMap.message : {};
      opts.message = await this.translator(opts.message, interpolationMap);
      opts.message = this.toStandardAlertMessage(opts.message);
    }

    if (opts.subTitle) {
      const interpolationMap = alertInterpolationMap ? alertInterpolationMap.subTitle : {};
      opts.subTitle = await this.translator(opts.subTitle, interpolationMap);
    }

    if (opts.buttons) {
      const localTranslator = (button) => this.translateAlertButton(button);
      const buttons = await Promise.all(opts.buttons.map(localTranslator));

      if (buttons) {
        opts.buttons = buttons;
      }
    }

    if (opts.inputs) {
      const localTranslator = (input) => this.translateAlertInput(input);
      const inputs = await Promise.all(opts.inputs.map(localTranslator));

      if (inputs) {
        opts.inputs = inputs;
      }
    }

    return this.alertCtrl.create(opts);
  }

}
