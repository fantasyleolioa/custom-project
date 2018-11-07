import {Component, ViewEncapsulation, Input} from '@angular/core';

@Component({
  selector: 'TabContent1',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./tabContent1.scss'],
  templateUrl: './tabContent1.html'
})
export class TabContent1Component {

  // Property
  @Input() message: string;


  // Constructor
  constructor() {  }
}
