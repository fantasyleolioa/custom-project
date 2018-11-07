import {Component, ViewEncapsulation, Input} from '@angular/core';

@Component({
  selector: 'Cac',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cac.scss'],
  templateUrl: './cac.html'
})
export class CacComponent {

  // Property
  @Input() message: string;


  // Constructor
  constructor() {  }
}
