import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { GlobalState } from '../../../global.state';
import { ButtonSetting } from '../../../domain/ButtonSetting';
import { Location } from "@angular/common";

import { ContentTopService } from '../../../service/contentTopService/ContentTop.service';


@Component({
  selector: 'ba-content-top',
  styleUrls: ['./baContentTop.scss'],
  templateUrl: './baContentTop.html',
})
export class BaContentTop {

  public activePageTitle: string = '';
  public buttonList: ButtonSetting[] = [];
  public editStatus: boolean = false;
  public processing: boolean = false;
  public isLastPage: boolean = false;
  public isLastPageCustom:boolean = false;
  public directUrl: string = '';

  private saveEventName: string = '';
  private cancelEventName: string = '';

  constructor(private _state: GlobalState, private _localState:ContentTopService, private locatoin:Location, private router:Router) {
    this._state.subscribe('menu.activeLink', (activeLink) => {
      if (activeLink) {
        
        this.activePageTitle = activeLink.title;

        this.isLastPage = false;
        this.isLastPageCustom = false;
      }
    });

    this.EnvironmentStart();
  }

  // Real Method
  public Save(){
    
    this.editStatus = false;
    this._localState.notifyDataChanged("button.trigger", this.saveEventName);
  }

  public Cancel(){
    
    this.editStatus = false;
    this._localState.notifyDataChanged("button.trigger", this.cancelEventName);
  }

  public backLastPage(){
    if(this.directUrl != ''){
      
      this.router.navigate([this.directUrl]);
    }
    else{

      this.locatoin.back();
    }

    this.directUrl = '';
    this.isLastPage = !this.isLastPage;
  }

  public backLastPageCustom(){

    this.isLastPageCustom = !this.isLastPageCustom;
    this._localState.notifyDataChanged('button.trigger', 'contentTop.backCustom');
  }


  // Button Trigger
  private TriggerButton(eventName:string){

    this._localState.notifyDataChanged("button.trigger", eventName);
  };

  // Global Subscribe
  private EnvironmentStart(){
    this._localState.subscribe('environment.setting', (environmentSetting:ButtonSetting[]) => {
      
      if (environmentSetting.length <= 4){
        this.buttonList = environmentSetting;
      };
    });

    this._localState.subscribe('menu.activeLink', (activeLink) => {
      if (activeLink) {
        this.activePageTitle = activeLink.title;
      };
    });

    this._localState.subscribe("contentTop.add", (buttonSetting:ButtonSetting) => {

      let addStatus:boolean = true;

      this.buttonList.forEach(
        (item:ButtonSetting, index:number) => {
          
          if (item.Id == buttonSetting.Id){

            this.buttonList[index] = buttonSetting;
            addStatus = false;
          }
        }
      );

      if(this.buttonList.length < 5 && addStatus){
        this.buttonList.push(buttonSetting);
      };
    });

    this._localState.subscribe('status.change', (status) => {

      if (status == "edit"){

        this.editStatus = true;
      };

      if (status == "normal"){

        this.editStatus = false;
      };
    });

    this._localState.subscribe('contentTop.delete', (id:string) => {

      this.buttonList.forEach(
        (item:ButtonSetting, index:number) => {

          if(item.Id == id){
            this.buttonList.splice(index, 1);
          }
        }
      );
    });

    this._localState.subscribe('contentTop.disabled', (id:string) => {

      this.buttonList.forEach(
        (item:ButtonSetting, index:number) => {

          if(item.Id == id){
            this.buttonList[index].IsDisabled = true;
          }
        }
      );
    });

    this._localState.subscribe('contentTop.unDisabled', (id:string) => {

      this.buttonList.forEach(
        (item:ButtonSetting, index:number) => {

          if(item.Id == id){
            this.buttonList[index].IsDisabled = false;
          }
        }
      );
    });

    this._localState.subscribe('contentTop.processing', (status:boolean) => {

      this.processing = status;
    });

    this._localState.subscribe('eventSetting.saveButton', (eventName:string) => {

      this.saveEventName = eventName;
    });

    this._localState.subscribe('eventSetting.cancelButton', (eventName:string) => {

      this.cancelEventName = eventName;
    });

    this._localState.subscribe('contentTop.lastPageActive', (status) => {

      if(typeof status === 'object'){

        this.directUrl = status.directPage;
        this.isLastPage = status.status;
      }
      else{
        this.directUrl = '';
        this.isLastPage = status;
      }
    });

    this._localState.subscribe('contentTop.LastPageCustomActive', (status) => {
      
      this.isLastPageCustom = status;
    });
  };
}
