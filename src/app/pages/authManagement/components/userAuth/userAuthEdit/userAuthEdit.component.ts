import { Component, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Tab } from "../../../../../domain/Tab";
import { UserInfo } from "../../../../../domain/UserInfo";
import { BasicMetadata } from '../../../../../domain/BasicMetadata';
import { DataPolicy } from "../../../../../domain/DataPolicy";
import { ConditionInfo } from "../../../../authTree/domain/conditoinInfo";
import { AuthSource } from "../../../../authTree/domain/authSource";
import { AuthTree } from "../../../../authTree/domain/authTree";
import { AppPermission } from "../../../../authTree/domain/appPermission";

import { AuthTreeService } from '../../../../authTree/service/authTree.service';
import { ContentTopService } from '../../../../../service/contentTopService/ContentTop.service';
import { CCContext } from "../../../../../domain/CCContext";
import { BaThemeSpinner } from "../../../../../theme/services/baThemeSpinner";



@Component({
  selector: 'UserAuthEdit',
  styleUrls: [('./userAuthEdit.scss')],
  templateUrl: './userAuthEdit.html'
})
export class UserAuthEdit implements OnDestroy{

  public edittedUser: UserInfo = new UserInfo("", "", "");

  public appList: BasicMetadata[] = [];
  public selectedApp:string = '请选择欲浏览的应用';

  public sourceUserPermission: AppPermission;
  public userAuthTreeData: AuthTree[] = [];

  public sourceUserDataPolicy: DataPolicy[] = [];

  public tabList:Tab[] = [];

  public isDataEditting: boolean = false;

  ngOnDestroy(){

    window.sessionStorage.removeItem("authTabStatus");
    window.sessionStorage.removeItem("selectedApp");
  }

  constructor(private ccContext:CCContext,
              private router:Router,
              private authTreeService:AuthTreeService,
              private contentTopService: ContentTopService,
              private preloader: BaThemeSpinner,) {


    this.preloader.preloaderShow();
    this.contentTopService.clearSubscribe("button.trigger");
    
    this.tabList.push(new Tab(false, '功能', 'UserFunction'));
    this.tabList.push(new Tab(false, '數據', 'UserDataPolicy'));

    let tabStatus = window.sessionStorage.getItem("authTabStatus");

    if(tabStatus == 'dataPolicy'){

      this.tabList[1].isFocus = true;
    }
    else{

      this.tabList[0].isFocus = true
    }

    this.edittedUser = JSON.parse(window.sessionStorage.getItem('EdittedUser'));

    if(this.edittedUser){

      this.ccContext.ApplicationRepository.GetAllApp()
          .subscribe(
            (result:BasicMetadata[]) => {
              this.appList = result;

              this.appList.forEach(
                (item, index) => {

                    if (item.name == "管理後臺"){

                      this.appList.splice(index, 1);
                    };
                  }
                );

              let appId = window.sessionStorage.getItem("selectedApp");
              if(appId){
                this.selectedApp = appId;

                this.ccContext.AuthRepository.GetUserPermission(this.edittedUser.id, this.selectedApp)
                    .subscribe(
                      (result) => {

                        this.sourceUserPermission = result.permission;
                        this.userAuthTreeData = this.authTreeService.TransferApplication(result.permission);
                        this.preloader.preloaderHide();
                      } 
                    );
              }
              else{

                this.preloader.preloaderHide();
              }
            },
            (error) => {

              this.preloader.preloaderHide();
            }
          );

      this.ccContext.AuthRepository.GetUserDataPolicy(this.edittedUser.id)
          .subscribe(
            (result) => {

              this.sourceUserDataPolicy = result;

              this.sourceUserDataPolicy.forEach(
                (item) => {
                  item.subCollapsed = true;
                  if(item.expiredTime != ''){
                    item.expiredDate = item.expiredTime.split('T')[0].replace('-', '/').replace('-', '/');                          
                  }
                  if(item.effectiveTime != ''){
                    item.effectiveDate = item.effectiveTime.split('T')[0].replace('-', '/').replace('-', '/');                          
                  }
                  
                  item.statements.forEach(
                    (statement) => {

                      statement.affectedOrgTypesCollapsed = true;
                      statement.targetOrgsCollapsed = true;
                      statement.targetOrgTagsCollapsed = true;
                    }
                  );
                }
              );
            },
            (error) => {

              this.preloader.preloaderHide();
            }
          );
      
      this.EnvironmentSetting();
      this.EnvironmentStart();
    }
    else{
      this.edittedUser = new UserInfo("", "", "");
      window.sessionStorage.clear();
      window.sessionStorage.setItem("redirectPage", '/pages/permissionsManagement/authUserQuery');
      window.alert("需要重新登入，将导向回登入页入页");
      this.router.navigate(["/login"]);
    }
    
    
  }


  // Binding Method
  public appSelected(target){

    this.preloader.preloaderShow();
    this.selectedApp = target;

    this.ccContext.AuthRepository.GetUserPermission(this.edittedUser.id, this.selectedApp)
        .subscribe(
          (result) => {

            this.preloader.preloaderHide();
            this.sourceUserPermission = result.permission;
            this.userAuthTreeData = this.authTreeService.TransferApplication(result.permission);

            this.contentTopService.notifyDataChanged('button.trigger', 'treeStatusReset');
          } 
        );
  }


  // State Trigger
  private EnvironmentSetting() {

    let title = this.edittedUser.name + '(' + this.edittedUser.id + ')';
    this.contentTopService.TitleSetting(title);

    this.contentTopService.ChangeStatus("normal");
    this.contentTopService.SetBackLastCustom(true);
    this.contentTopService.EnvironmentSetting([]);
  };


  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      
      if(eventName == 'backToLastPage'){

        this.router.navigate(['/pages/permissionsManagement/authUserQuery']);
      }
    });
  };
  
  
  // Private
  public tabButtonClick(target: Tab){  
    this.tabList.forEach(
      (ele) => {

        if(ele == target){
          ele.isFocus = true
        }
        else{
          ele.isFocus = false;
        };
      }
    );
  }
}
