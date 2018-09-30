import { Component, Input } from '@angular/core';
import { DeviceProvider } from '../../providers/device/device';
import { PageLocationProvider } from '../../providers/page-location/page-location';

@Component({
  selector: 'app-content',
  templateUrl: 'app-content.html'
})
export class AppContentComponent {

  @Input() title: string;
  @Input() padding = true;

  constructor(
    public deviceStatus: DeviceProvider,
    public pageLocation: PageLocationProvider,
  ) {}

}
