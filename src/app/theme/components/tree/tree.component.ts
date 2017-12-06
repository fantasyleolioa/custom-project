import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { TreeData } from '../../../domain/TreeData';

@Component({
  selector: 'tree',
  templateUrl: './tree.html',
  styleUrls: ['./tree.scss'],
})
export class TreeComponent {

    @Input() menuItem: TreeData;
    @Input() editStatus: string;
    @Input() isRoot: boolean;
    @Input() isRoleCatalog: boolean;
    @Input() isStateEdit: boolean;
    @Input() withBorderBottom: string;
    @Input() mainTree: TreeData[];
    @Input() edittingLock: boolean;
    
    @Output() childNotification: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }


    // Public Method (Click Button Relate)
    public checkedButtonClick(buttonValue: boolean, childTree: TreeData[]) {

      if (this.menuItem.isIndeterminate) {

        this.menuItem.checked = true;
        this.menuItem.isIndeterminate = false;
        this.childCheckedAllChanged(true, childTree);
      }
      else {

        if (!buttonValue) {

          this.menuItem.checked = true;
          this.childCheckedAllChanged(true, childTree);
        }
        else {

          this.menuItem.checked = false;
          this.childCheckedAllChanged(false, childTree);
        }
      }

      this.eventNotify('checked.indeterminate');
    }

    public DeepestButtonClick(buttonValue: boolean) {

      if (!buttonValue) {

        this.menuItem.checked = true;
        this.eventNotify('checked.indeterminate');
      }
      else {

        this.menuItem.checked = false;
        this.eventNotify('checked.allIndeterminateOff');
      }

      this.eventNotify('getResult');
    }

    public radioButtonClick(buttonValue: boolean, childTree: TreeData[], trigger: TreeData) {
      
      
      if (!buttonValue) {

        this.menuItem.singleChecked = true;

        if (this.isRoot) {

          this.childSingleCheckedAllChanged(this.mainTree, trigger);
          this.eventNotify('getResult');
        }
        else {

          const singleChecked = {'eventName': 'singleChecked.allOff', 'trigger': trigger };
          this.eventNotify(singleChecked);
        }  
      }
      else {

        this.menuItem.singleChecked = false;

        this.eventNotify('singleChecked.checkedOff');
      }
    }

    public settingButtonClick(trigger: TreeData) {

      const result =  { 'eventName': 'state.settingEdit'  , 'trigger': trigger };

      this.eventNotify(result);
    }


    // Private Method
    // Event Emitter
    private getNotify(event: any) {

      if (typeof(event) === 'object') {

        if (event.eventName == 'singleChecked.allOff') {

          this.singleCheckedSetted(event);
        }

        if (event.eventName == 'state.settingEdit') {

          this.eventNotify(event);
        }
      }

      if (event == 'checked.indeterminate') {

        this.setIndeterminate();
      }

      if (event == 'checked.allIndeterminateOn') {

        this.menuItem.checked = false;
        this.menuItem.isIndeterminate = true;
        this.eventNotify('checked.allIndeterminateOn');
      }

      if (event == 'checked.allIndeterminateOff') {

        this.deepestSetIndeterminate();
      }

      if (event == 'getResult') {

        this.eventNotify('getResult');
      }

      if (event == 'singleChecked.checkedOff') {

        this.eventNotify('singleChecked.checkedOff');
      }
    }

    private eventNotify(event: any) {

      this.childNotification.emit(event);
    }


    // Subscribe Method
    private setIndeterminate() {

      if (this.checkChildStatusTrue(this.menuItem.child)) {

        this.menuItem.checked = true;
        this.menuItem.isIndeterminate = false;

        this.eventNotify('checked.indeterminate');
      }
      else {

        this.menuItem.checked = false;
        this.menuItem.isIndeterminate = true;

        if (this.checkChildStatusFalse(this.menuItem.child)) {

          this.menuItem.isIndeterminate = false;
          this.eventNotify('checked.indeterminate');
        }
        else {
          this.eventNotify('checked.allIndeterminateOn');
        }
      }
    }

    private deepestSetIndeterminate() {

      if (this.checkChildStatusFalse(this.menuItem.child)) {
        
        this.menuItem.checked = false;
        this.menuItem.isIndeterminate = false;
        this.eventNotify('checked.allIndeterminateOff');
      }
      else { 

        this.menuItem.checked = false;
        this.menuItem.isIndeterminate = true;
        this.eventNotify('checked.allIndeterminateOn');
      }
    }

    private singleCheckedSetted(singleCheckObject: any) {

      this.menuItem.singleChecked = false;
      
      if (this.isRoot) {
        this.childSingleCheckedAllChanged(this.mainTree, singleCheckObject.trigger);
        this.eventNotify('getResult');
      }
      else {
        this.eventNotify(singleCheckObject);
      }
    }


    // Functional Method
    private childCheckedAllChanged(targetValue: boolean, childTree: TreeData[]) {

      childTree.forEach(
          (item: TreeData) => {

            item.checked = targetValue;

            if (targetValue) {
              item.isIndeterminate = false;
            }

            if (item.child.length > 0) {
              this.childCheckedAllChanged(targetValue, item.child);
            }

          },
        );
    }

    private childSingleCheckedAllChanged(childTree: TreeData[], trigger: TreeData) {

      childTree.forEach(
          (item: TreeData) => {

            if (item != trigger) {
              item.singleChecked = false;
            }
            
            if (item.child.length > 0) {
              this.childSingleCheckedAllChanged(item.child, trigger);
            }
          },
        );
    }

    private checkChildStatusTrue(targetTree: TreeData[]) {

      let result = true;
      
      targetTree.forEach(
        (item) => {

          if (!item.checked) {

            result = false;
            return result;
          }

          if (item.child.length > 0) {

            if (!this.checkChildStatusTrue(item.child)) {
              result = false;
              return result;
            }
          }
        },
      );

      return result;
    }

    private checkChildStatusFalse(targetTree: TreeData[]) {

      let result = true;
      
      targetTree.forEach(
        (item) => {

          if (item.checked) {

            result = false;
            return result;
          }

          if (item.child.length > 0) {

            if (!this.checkChildStatusFalse(item.child)) {
              result = false;
              return result;
            }
          }
        },
      );

      return result;
    }  
}
