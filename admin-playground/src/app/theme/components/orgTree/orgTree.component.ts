import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';

import { TreeData } from '../../../domain/TreeData';

@Component({
  selector: 'orgTree',
  styleUrls: ['./orgTree.scss'],
  templateUrl: './orgTree.html'
})
export class OrgTreeComponent {

    @Input() menuItem:TreeData;
    @Input() editStatus:string;
    @Input() isRoot:boolean;
    @Input() isAspect:boolean;
    @Input() isStateEdit:boolean;
    @Input() withBorderBottom:string;
    @Input() mainTree:TreeData[];
    
    @Output() childNotification:EventEmitter<string> = new EventEmitter<string>();

    constructor() { }


    // Public Method (Click Button Relate)
    public checkedButtonClick(buttonValue:boolean, childTree:TreeData[]){

      if (!buttonValue){

        this.menuItem.checked = true;
        this.eventNotify("getResult");
      }
      else{

        this.menuItem.checked = false;

        let result = { "target": this.menuItem, "eventName": "remove" };
        this.eventNotify(result);
      };
    };

    public DeepestButtonClick(buttonValue:boolean){

      if (!buttonValue){

        this.menuItem.checked = true;
        this.eventNotify("getResult");
      }
      else{

        this.menuItem.checked = false;
        let result = { "target": this.menuItem, "eventName": "remove" };
        this.eventNotify(result);
      };
    };


    // Private Method
    // Event Emitter
    private getNotify(event:any){

      if(event == "getResult"){

        this.eventNotify("getResult");
      };
      if(event.eventName == "remove"){

        this.eventNotify(event);
      };
    };

    private eventNotify(event:any){

      this.childNotification.emit(event);
    };
}
