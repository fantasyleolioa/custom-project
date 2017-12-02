import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Tab } from "../../../../../domain/Tab";
import { AuthDataButton } from "../../../../../domain/ButtonSetting";
import { CCContext } from '../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../service/contentTopService/ContentTop.service';
import { UserInfo } from '../../../../../domain/UserInfo';
import { BasicMetadata } from '../../../../../domain/BasicMetadata';
import { ConditionInfo } from "../../../../authTree/domain/conditoinInfo";
import { AuthTree } from "../../../../authTree/domain/authTree";
import { AppPermission } from "../../../../authTree/domain/appPermission";
import { OrgPermission } from "../../../../authTree/domain/orgPermission";
import { RolePermission } from "../../../../authTree/domain/rolePermission";
import { AppInfo } from "../../../../authTree/domain/appInfo";
import { UserDataPolicyView, DataPolicyResultList, DataPolicyRoleList, DataPolicyUserList } from "../../../../../domain/DataPolicy";

import { AuthTreeService } from '../../../../authTree/service/authTree.service';
import { BaThemeSpinner } from "../../../../../theme/services";


@Component({
  selector: 'authDataEdit',
  styleUrls: [('./authDataEdit.scss')],
  templateUrl: './authDataEdit.html'
})
export class AuthDataEdit{

  public userInfo:UserInfo = new UserInfo("", "", "");

  public tabList:Tab[] = [];

  public selectedApp:string = '请选择欲浏览的应用';
  public appList:BasicMetadata[] = [];
  public userAuthTreeData:AuthTree[] = [];
  public rolePermissionList:RolePermission[] = [];
  public orgPermissionList:OrgPermission[] = [];
  public resultPermission:AppPermission = new AppPermission(new AppInfo('', ''), [], []);

  public userDatapolicyList: DataPolicyResultList[] = [];
  public roleDatapolicyList: DataPolicyRoleList[] = [];
  public resultDatapolicyList: DataPolicyResultList[] =[];

  public authDataButtonList:AuthDataButton[] = [];
  public policDataButtonList:AuthDataButton[] = [];

 
  constructor(private contentTopService: ContentTopService, 
              private router: Router,
              private preloader: BaThemeSpinner, 
              private authTreeService: AuthTreeService,
              private ccContext:CCContext) {

    this.preloader.preloaderShow();
    this.contentTopService.clearSubscribe("button.trigger");

    this.userInfo = JSON.parse(window.sessionStorage.getItem("EdittedUser"));

    this.tabList.push(new Tab(true, '功能', 'PreviewFunction'));
    this.tabList.push(new Tab(false, '數據', 'PreviewDataPolicy'));

    this.authDataButtonList.push(new AuthDataButton('resultView', true));
    this.authDataButtonList.push(new AuthDataButton('orgView', false));
    this.authDataButtonList.push(new AuthDataButton('roleView', false));
    this.authDataButtonList.push(new AuthDataButton('userView', false));

    this.policDataButtonList.push(new AuthDataButton('resultView', true));
    this.policDataButtonList.push(new AuthDataButton('actionView', false));
    this.policDataButtonList.push(new AuthDataButton('roleView', false));
    this.policDataButtonList.push(new AuthDataButton('userView', false));

    if(this.userInfo){
      
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
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }

              this.preloader.preloaderHide();
            }
          ); 

      this.ccContext.AuthRepository.GetAllDatapolicy(this.userInfo.id)
          .subscribe(
            (result:UserDataPolicyView) => {

              console.log(result);
              this.resultDatapolicyList = result.result;
              this.userDatapolicyList = result.user.dataPermission;
              this.roleDatapolicyList = result.role;

              this.roleDatapolicyList.forEach(
                (item) => {

                  item.subCollapsed = true;
                }
              );

              this.preloader.preloaderHide();
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }

              this.preloader.preloaderHide();
            }
          );

      this.EnvironmentSetting();
      this.EnvironmentStart();
    }
    else{

      window.sessionStorage.clear();
      window.sessionStorage.setItem("redirectPage", '/pages/permissionsManagement/authDataQuery');
      window.alert("需要重新登入，将导向回登入页入页");
      this.router.navigate(["/login"]);
    }
  };


  //Binding Method
  public appSelected(target){

    this.selectedApp = target;

    this.preloader.preloaderShow();
    this.ccContext.AuthRepository.GetAllPermission(this.userInfo.id, this.selectedApp)
        .subscribe(
          (result) => {

            this.resultPermission = result.result;
            this.rolePermissionList = result.role;
            this.rolePermissionList.forEach(
              (item) => {
                item.subCollapsed = true;
                item.authData = this.authTreeService.TransferApplication(item.permission);
              }
            );
            this.orgPermissionList = result.org;
            this.orgPermissionList.forEach(
              (item) => {
                item.subCollapsed = true;
                item.authData = this.authTreeService.TransferApplication(item.permission);
              }
            )
            this.userAuthTreeData = this.authTreeService.TransferApplication(result.user.permission);

            this.preloader.preloaderHide();
          }
        )
  }


  // Enviroment 
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      
    });
  };

  private EnvironmentSetting() {

    let title = this.userInfo.name + '(' + this.userInfo.id + ')';
    this.contentTopService.TitleSetting(title);

    this.contentTopService.ChangeStatus("normal");
    this.contentTopService.SetBackLastPage(true);
    this.contentTopService.SetBackLastCustom(false);
    this.contentTopService.EnvironmentSetting([]);
  };


  // Private
  public tabButtonClick(target: Tab){  
    this.authViewButtonClick(this.authDataButtonList[0]);
    this.policyViewButtonClick(this.policDataButtonList[0]);

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

  public authViewButtonClick(target: AuthDataButton){

    this.authDataButtonList.forEach(
      (item) => {

        if(item == target){
          item.isActive = true;
        }else{
          item.isActive = false
        }
      }
    );
  }

  public policyViewButtonClick(target: AuthDataButton){
    
    this.policDataButtonList.forEach(
      (item) => {

        if(item == target){
          item.isActive = true;
        }else{
          item.isActive = false
        }
      }
    );
  }
}