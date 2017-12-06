import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';

import { OrgInOrgTag, OrgTag, OrgTagTreeData } from "../../../domain/OrgInfo";


@Component({
  selector: 'orgTagTree',
  styleUrls: ['./orgTagTree.scss'],
  templateUrl: './orgTagTree.html'
})
export class OrgTagTreeComponent {

    @Input() menuItem:OrgTagTreeData;
    @Input() editStatus:string;
    @Input() isChild:boolean;
    @Input() isList: boolean;
    @Input() withBorderBottom:string;
    @Input() mainTree:OrgTagTreeData[];
    
    @Output() childNotification:EventEmitter<string> = new EventEmitter<string>();

    constructor() { }


    // Public Method (Click Button Relate)
    public checkedButtonClick(buttonValue:boolean, childTree:OrgTagTreeData[]){

      if(this.editStatus){
        if (!buttonValue){
          
          this.menuItem.checked = true;
          this.eventNotify("getResult");
        }
        else{
  
          this.menuItem.checked = false;
  
          let result = { "target": this.menuItem, "eventName": "remove" };
          this.eventNotify(result);
        };
      }
      else{
        this.menuItem.subCollapsed = !this.menuItem.subCollapsed;
      }
    };

    public removeButtonClick(target:OrgTagTreeData){
      
      let result = { "target": target, "eventName": "userInOrgTag.remove" }
      this.eventNotify(result);
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
