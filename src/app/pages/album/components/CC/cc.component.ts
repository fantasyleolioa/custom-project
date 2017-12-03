import {Component, ViewEncapsulation, Input} from '@angular/core';

@Component({
  selector: 'CC',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cc.scss'],
  templateUrl: './cc.html'
})
export class CCComponent {

  // Property
  @Input() message: string;


  // Constructor
  constructor() {  }
}
