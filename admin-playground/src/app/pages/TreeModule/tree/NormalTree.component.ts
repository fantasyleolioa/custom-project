import {Component, ViewEncapsulation, Input, Output, EventEmitter, NgZone} from '@angular/core';

import { TreeData } from '../../../domain/TreeData';

@Component({
  selector: 'NormalTree',
  styleUrls: ['./normalTree.scss'],
  templateUrl: './normalTree.html'
})
export class NormalTreeComponent {

    @Input() menuItem:TreeData;
    @Input() editStatus:string;
    @Input() isRoot:boolean;
    @Input() isAspect:boolean;
    @Input() isStateEdit:boolean;
    @Input() hideTypeName:boolean;
    @Input() isEditButton: boolean;
    @Input() withBorderBottom:string;
    @Input() mainTree:TreeData[];
    
    @Output() childNotification:EventEmitter<string> = new EventEmitter<string>();

    constructor(private zone:NgZone) { }


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

    public radioButtonClick(buttonValue: boolean) {
      
      if (!buttonValue) {

        this.menuItem.checked = true;

        this.childCheckedAllChanged(this.menuItem, false, this.mainTree);
        this.eventNotify('singleChecked.checkChanged');
      }
      else {

        this.menuItem.checked = false;
        this.eventNotify('singleChecked.checkChanged');
      }
    }

    public EditButtonClick(){

      let result = {eventName:'editButton.click', target:this.menuItem};

      this.eventNotify(result);
    };


    // Private Method
    // Event Emitter
    private getNotify(event:any){

      if(event == "getResult"){

        this.eventNotify("getResult");
      };
      if(event == "singleChecked.checkChanged"){

        this.eventNotify(event);
      };
      if(event.eventName == "remove"){

        this.eventNotify(event);
      };
      if(event.eventName == "editButton.click"){

        this.eventNotify(event);
      };
    };

    private eventNotify(event:any){

      this.childNotification.emit(event);
    };


    // Iterator
    private childCheckedAllChanged(targetItem:TreeData, target:boolean, childTree:TreeData[]){

      this.zone.runOutsideAngular(
        () => {
          childTree.forEach(
            (item:TreeData) => {

              if(item != targetItem){
                item.checked = target;
              }

              if(item.child.length > 0){
                this.childCheckedAllChanged(targetItem, target, item.child);
              };
            }
          );
        }
      );
    };
}
