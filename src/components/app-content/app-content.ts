import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { title } from '../../app/constants';
import { appTitle as globalAppTitle } from '../../global';
import { DeviceProvider } from '../../providers/device/device';
import { PageLocationProvider } from '../../providers/page-location/page-location';
import { ThemeProvider } from '../../providers/theme/theme';

@Component({
  selector: 'app-content',
  templateUrl: 'app-content.html',
})
export class AppContentComponent implements OnInit {

  @Input() title: string;
  @Input() padding = true;

  selectedTheme: string;
  appTitle = globalAppTitle;

  constructor(
    public deviceStatus: DeviceProvider,
    public pageLocation: PageLocationProvider,
    public titleService: Title,
    public themeProvider: ThemeProvider,
  ) {
    this.themeProvider.getActiveTheme().subscribe((val) => {
      this.selectedTheme = val;
    });
  }

  ngOnInit() {
    // Without setTimeout the title will revert back
    setTimeout(() => {
      if (this.title) {
        this.titleService.setTitle(`${this.appTitle} ${title.separator} ${this.title}`);
      } else {
        this.titleService.setTitle(this.appTitle);
      }
    }, 50);
  }

}
