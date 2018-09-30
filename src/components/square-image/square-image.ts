import { Component, Input } from '@angular/core';


@Component({
  selector: 'square-image',
  templateUrl: 'square-image.html',
})
export class SquareImageComponent {

  @Input() src: string;

  constructor() {
  }

}
