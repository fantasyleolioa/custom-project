import { Component, ViewEncapsulation, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthTree } from '../domain/authTree';


@Component({
  selector: 'authTree',
  styleUrls: [('./authTree.scss')],
  templateUrl: './authTree.html'
})
export class AuthTreeComponent {

  @Input() menuItem:AuthTree;
  @Input() editStatus:string;
  @Input() isStateEdit:boolean;
  @Input() withBorderBottom:string;
  @Input() isResult:boolean;
  @Input() isIDShow: boolean;
    
  @Output() childNotification:EventEmitter<PermissionEmit> = new EventEmitter<PermissionEmit>();
 
  constructor(private zone:NgZone) {  }


    // Public Method (Click Button Relate)
    public allowButtonClick(buttonValue:boolean, childTree:AuthTree[]){

      this.menuItem.deny = false;

      if (!buttonValue){

        this.menuItem.allow = true;
        this.childCheckedAllAllow(childTree);
      }
      else{

        this.menuItem.allow = false;
        this.childCheckedAllEmpty(childTree);
      }

      this.effectChanged();
    };

    public denyButtonClick(buttonValue:boolean, childTree:AuthTree[]){

      this.menuItem.allow = false
      
      if (!buttonValue){

        this.menuItem.deny = true;
        this.childCheckedAllDeny(childTree);
      }
      else{

        this.menuItem.deny = false;
        this.childCheckedAllEmpty(childTree);
      }

      this.effectChanged();
    };


    public settingButtonClick(trigger:AuthTree){

      let result = new PermissionEmit("settingButton.click", trigger)
      this.eventNotify(result);
    };


    // Private Method
    // Event Emitter
    private getNotify(event:PermissionEmit){
      if (event.name == 'effect.changed'){

        this.zone.runOutsideAngular(
          () => {
            if(event.target.effect == 'allow'){
              this.menuItem.deny = false;
              this.menuItem.allow = true;
            }
            else if(event.target.effect == 'deny'){
              
              if(this.checkedEffectAllDeny(this.menuItem.child)){
                this.menuItem.deny = true;
                this.menuItem.allow = false;
              }
              else{
                this.menuItem.deny = false;
                this.menuItem.allow = true;
              }
            } 
            else if(event.target.effect == '[empty]'){
              if(this.checkedEffectAllEmpty(this.menuItem.child)){
                this.menuItem.deny = false;
                this.menuItem.allow = false;
              }
              else{
                this.menuItem.deny = false;
                this.menuItem.allow = true;
              }
            }

            this.effectChanged();
          }
        )
      };
      if (event.name == 'settingButton.click'){
        this.eventNotify(event);
      };
    };

    private eventNotify(event:PermissionEmit){

      this.childNotification.emit(event);
    };
    

    // Functional Method
    private childCheckedAllAllow(childTree:AuthTree[]){

      this.zone.runOutsideAngular(
        () => {
          childTree.forEach(
            (item:AuthTree) => {

              item.allow = true;
              item.deny = false;

              this.childEffectChanged(item);

              if(item.child.length > 0){
                this.childCheckedAllAllow(item.child);
              };
            }
          );
        }
      );
    };

    private childCheckedAllDeny(childTree:AuthTree[]){

      this.zone.runOutsideAngular(
        () => {
          childTree.forEach(
            (item:AuthTree) => {

              item.deny = true;
              item.allow = false;

              this.childEffectChanged(item);

              if(item.child.length > 0){
                this.childCheckedAllDeny(item.child);
              };
            }
          );
        }
      );
    };

    private childCheckedAllEmpty(childTree:AuthTree[]){

      this.zone.runOutsideAngular(
        () => {
          childTree.forEach(
            (item:AuthTree) => {

              item.deny = false;
              item.allow = false;

              this.childEffectChanged(item);

              if(item.child.length > 0){
                this.childCheckedAllEmpty(item.child);
              };
            }
          );
        }
      );
    };

    private childEffectChanged(authTreeData:AuthTree){
      let target; 

      if(authTreeData.allow){

        target = new PermissionEffectInfo(authTreeData.id, authTreeData.moduleId, "allow");
      }
      else if(authTreeData.deny){

        target = new PermissionEffectInfo(authTreeData.id, authTreeData.moduleId, "deny");
      }
      else{

        target = new PermissionEffectInfo(authTreeData.id, authTreeData.moduleId, "[empty]");
      };

      let result = new PermissionEmit("effect.changed", target)
      this.eventNotify(result);
    };

    private effectChanged(){
      let target;

      if(this.menuItem.allow){

        target = new PermissionEffectInfo(this.menuItem.id, this.menuItem.moduleId, "allow");
      }
      else if(this.menuItem.deny){

        target = new PermissionEffectInfo(this.menuItem.id, this.menuItem.moduleId, "deny");
      }
      else{

        target = new PermissionEffectInfo(this.menuItem.id, this.menuItem.moduleId, "[empty]");
      };

      let result = new PermissionEmit("effect.changed", target)
      this.eventNotify(result);
    };

    private checkedEffectAllDeny(childTree:AuthTree[]){

      var result = true;
      childTree.forEach(
        (item) => {
          if(item.child.length > 0){
            result = this.checkedEffectAllDeny(item.child);
          }
        }
      );
      childTree.forEach(
        (item) => {
          if(!(item.deny == true && item.allow == false)){
            result = false;
          }
        }
      );

      return result;
    }

    private checkedEffectAllEmpty(childTree:AuthTree[]){

      var result = true;
      childTree.forEach(
        (item) => {
          if(item.child.length > 0){
            result = this.checkedEffectAllEmpty(item.child);
          }
        }
      );

      childTree.forEach(
        (item) => {
          if(!(item.deny == false && item.allow == false)){
            result = false;
          }
        }
      );

      return result;
    }
}

class PermissionEmit{

  name:string;
  target:any;

  constructor(_name:string, _target:any) {

    this.name = _name;
    this.target = _target;
  }
}

class PermissionEffectInfo{

  id:string;
  moduleId:string
  effect:string;

  constructor(_id:string, _moduleId:string, _effect:string){

    this.id = _id;
    this.moduleId = _moduleId;
    this.effect = _effect;
  }
}