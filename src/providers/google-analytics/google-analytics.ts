import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Events, Platform } from 'ionic-angular';

@Injectable()
export class GoogleAnalyticsProvider {

  constructor(
    private events: Events,
    private googleAnalytics: GoogleAnalytics,
    public platform: Platform,
    public titleService: Title,
  ) {
    this.events.subscribe('view:enter', (view: string) => {
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.googleAnalytics.trackView(view);
      } else {
        // Reach here when web app is running.
        // Wait for title to update in app-content component.
        setTimeout(() => {
          (window as any).ga('set', 'page', view);
          (window as any).ga('send', 'pageview', { title : this.titleService.getTitle() });
        }, 100);
      }
    });

  }

}
