import {Component, ViewEncapsulation, Input} from '@angular/core';

@Component({
  selector: 'AppFoundry',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./appFoundry.scss'],
  templateUrl: './appFoundry.html'
})
export class AppFoundryComponent {

  // Property
  @Input() message: string;


  // Constructor
  constructor() {  }
}
