import { Component, ViewEncapsulation, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


import { Tab } from "../../../../domain/Tab";
import { RoleInfo } from "../../../../domain/RoleInfo";
import { BasicMetadata } from '../../../../domain/BasicMetadata';
import { ConditionInfo } from "../../../authTree/domain/conditoinInfo";
import { AuthSource } from "../../../authTree/domain/authSource";
import { AuthTree } from "../../../authTree/domain/authTree";
import { AppPermission } from "../../../authTree/domain/appPermission";
import { UpdatedSimplePermission } from "../../../authTree/domain/UpdatedSimplePermission";

import { AuthReflectService } from '../../../authTree/service/authReflect.service';
import { AuthTreeService } from '../../../authTree/service/authTree.service';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { CCContext } from "../../../../domain/CCContext";
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";



@Component({
  selector: 'FunctionAuth',
  styleUrls: [('./functionAuth.scss')],
  templateUrl: './functionAuth.html'
})
export class FunctionAuth {

  @Input() selectedApp:string;
  @Input() roleId: string;
  @Input() userId: string;
  @Input() sourcePermission: AppPermission;
  @Input() authTreeData: AuthTree[] = [];
  @Input() tabInfo: Tab;
  
  public treeStatus:string = "normal";
  public isStateView: boolean = false;

  public conditionList: Array<Array<ConditionInfo>>= [];
  public selectedAction: AuthTree  = new AuthTree("", "");

  public isChanged: boolean = false;
  public modalRef: NgbModalRef;
  @ViewChild('SaveModal') public SaveModal;
  
  ngAfterViewInit(){

  }

  constructor(private ccContext:CCContext,
              private router:Router,
              private authTreeService:AuthTreeService,
              private contentTopService: ContentTopService,
              private reflectService:AuthReflectService,
              private preloader: BaThemeSpinner,
              private modalService:NgbModal,) {
    
    this.EnvironmentStart();
  }


  // Binding Method
  public save(){

    if(this.modalRef) {
      
      if(this.isStateView){

        this.conditionSave();
      }

      this.modalRef.close();
    }
    this.isChanged = false;

    this.preloader.preloaderShow();

    let result: UpdatedSimplePermission;

    if(this.tabInfo.id == 'RoleFunction'){
      result = new UpdatedSimplePermission(this.roleId, this.sourcePermission);
      console.log(result);

      this.ccContext.AuthRepository.UpdateRolePermission(result)
          .subscribe(
            (result) => {

              this.treeStatus = 'normal';

              this.ccContext.AuthRepository.GetRolePermission(this.roleId, this.selectedApp)
                  .subscribe(
                    (result) => {

                      this.sourcePermission = result.permission;
                      this.authTreeData = this.authTreeService.TransferApplication(result.permission);

                      this.preloader.preloaderHide();
                    } 
                  );
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }
              
              this.preloader.preloaderHide();
              this.treeStatus = 'normal';
            }
          );
    }

    if(this.tabInfo.id == 'UserFunction'){
      result = new UpdatedSimplePermission(this.userId, this.sourcePermission);
      console.log(result);

      this.ccContext.AuthRepository.UpdateUserPermission(result)
          .subscribe(
            (result) => {

              this.treeStatus = 'normal';

              this.ccContext.AuthRepository.GetUserPermission(this.userId, this.selectedApp)
                  .subscribe(
                    (result) => {

                      this.sourcePermission = result.permission;
                      this.authTreeData = this.authTreeService.TransferApplication(result.permission);

                      this.preloader.preloaderHide();
                    } 
                  );
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }
              
              this.preloader.preloaderHide();
              this.treeStatus = 'normal';
            }
          );
    }
  };

  public conditionSave(){

    this.treeStatus = 'editted';

    let result = [];
    this.conditionList.forEach(
      (row) => {

        result = result.concat(row);
      }
    );

    result.forEach(
      (condition, index) => {
        if(condition.type == 'time'){

          let date = condition.date.replace('/', '-').replace('/', '-');
          condition.value = date + " " + condition.clock + ":" + condition.minute + ":" + condition.second;
        }
      }
    );

    this.selectedAction.condition = result;

    this.reflectService.reflectCondition(this.sourcePermission, this.selectedAction);
    this.authTreeData = this.authTreeService.TransferApplication(this.sourcePermission);

    console.log(this.sourcePermission);
    this.isStateView = false;
    this.isChanged = true;
  }

  public editState(){
    this.treeStatus = 'editted';
  };

  public backToFunctionAuthView(){

    this.modalRef = this.modalService.open(this.SaveModal);

    this.modalRef.result.then(
      (result) =>{
        this.contentTopService.SetBackLastCustom(true);
      },
      (reason) => {
        this.contentTopService.SetBackLastCustom(true);
      }
    );
  }
  
  public exitThisPage(){

    this.modalRef.close();
    this.contentTopService.notifyDataChanged('button.trigger', 'backToLastPage');
  }

  // Event Emitter
  private getNotify(event: any) {

    if (event.name == 'settingButton.click'){
      
      this.selectedAction = JSON.parse(JSON.stringify(event.target));
      this.conditionList = [];
      this.selectedAction.condition.forEach(
        (item) => {

          if(item.type == 'time'){
            let date:string = item.value.split(" ")[0];
            let divide = item.value.split(" ")[1];
            item.clock = divide.split(":")[0];
            item.minute = divide.split(":")[1];
            item.second = divide.split(":")[2];

            item.date = date;
          };
        }
      );

      for(let i=1; i<=Math.ceil( this.selectedAction.condition.length/3); i++){

        this.conditionList.push([]);
        for(let j=i*3-2; j<=i*3; j++){

          if( this.selectedAction.condition[j-1]) this.conditionList[i-1].push( this.selectedAction.condition[j-1]);
        };
      };

      this.isStateView = true;
      console.log(this.selectedAction);
    };

    if (event.name == 'effect.changed'){

      this.reflectService.reflectPermission(this.sourcePermission, event.target);
      this.isChanged = true;
    };
  };


  // Environment
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {

      if(eventName == 'contentTop.backCustom'){

        if(this.tabInfo.isFocus){

          if(this.treeStatus == 'editted'){


            this.modalRef = this.modalService.open(this.SaveModal);

            this.modalRef.result.then(
              (result) =>{
                if (result) this.contentTopService.SetBackLastCustom(true);
              },
              (reason) => {
                this.contentTopService.SetBackLastCustom(true);
              }
            );
          }
          else{
              
            this.contentTopService.notifyDataChanged('button.trigger', 'backToLastPage');
          }
        }
        
      }

      if(eventName == 'treeStatusReset'){
        this.treeStatus = 'normal';
      }
    });
  };
}
