import {Component, ViewEncapsulation, Input} from '@angular/core';

@Component({
  selector: 'TabContent2',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./tabContent2.scss'],
  templateUrl: './tabContent2.html'
})
export class TabContent2Component {

  // Property
  @Input() message: string;


  // Constructor
  constructor() {  }
}
