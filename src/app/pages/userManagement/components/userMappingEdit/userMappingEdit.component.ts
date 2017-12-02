import {Component, ViewEncapsulation, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { CCContext } from '../../../../domain/CCContext';
import { UserMappingInfo, UpdateMappingInfo } from '../../../../domain/UserMappingInfo';
import { UserInfo } from '../../../../domain/UserInfo';

import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";

import * as Crypto from 'crypto-js'

@Component({
  selector: 'userMappingEdit',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./userMappingEdit.scss'],
  templateUrl: './userMappingEdit.html'
})
export class UserMappingEdit {

  public userData: UserInfo = new UserInfo("", "", "");
  public mappingData: UserMappingInfo[] = [];
  public selectedMappingData:UserMappingInfo = new UserMappingInfo("", "", "", "");
  public mappingPsw:string = "";
  public mappingAccount:string = "";

  public isMapping:boolean = true;

  public editMappingSettingEvent:string = "";
  public saveMappingEvent:string = "";
  public cancelMappingEvent:string = "";

  public pannelEnvironment: ButtonSetting[] = [];
  public pageStatus:string = "normal";

  public modalConfirmText:string = "确定";
  public modalConfirmStatus:boolean = false;
  public errorContext:ErrorContext = new ErrorContext("test", "test");

  private modalRef:NgbModalRef;

  @ViewChild('VerifyErrorModal') public VerifyErrorModal;
 
  constructor(private contentTopService: ContentTopService, 
              private ccContext:CCContext,
              private router:Router,
              private loader:BaThemeSpinner,
              private modalService:NgbModal) 
  {
    this.contentTopService.clearSubscribe("button.trigger");
    this.userData = JSON.parse(window.sessionStorage.getItem("EdittedUserMapping"));

    if(this.userData.id){

      this.ccContext.UserRepository.GetUserMapping(this.userData.id)
          .subscribe(
            (result) => {

              this.mappingData = result;
              
              if(this.mappingData.length < 1){
                this.isMapping = false;
              }

              this.selectedMappingData = this.mappingData[0];
            }
          );


      this.contentTopService.ChangeStatus("normal");
      this.contentTopService.TitleSetting("归户设定");
      this.EventSetting();
      this.EnvironmentSetting();
      this.EnvironmentStart();

    }
    else{
      
      window.sessionStorage.clear();
      window.sessionStorage.setItem("redirectPage", '/pages/userManagement/userMappingQuery');
      window.alert("需要重新登入，将导向回登入页入页");
      this.router.navigate(["/login"]);
    }
  }

  public chooseMappingInfo(buttonValue:boolean, target:UserMappingInfo){

    this.mappingPsw = "";
    this.pageStatus = "dataEditting";

    if (!buttonValue){
        
      target.checked = true;
      this.selectedMappingData = target;
      
      this.mappingAccount = JSON.parse(JSON.stringify(this.selectedMappingData.verifyUserId));
      this.mappingData.forEach(
        (data) => {

          if(data != target){
            data.checked = false;
          }
        }
      );
    }
    else{
      
      this.mappingAccount = "";
      this.pageStatus = "editted";
      target.checked = false;
    };
  }

  public errorModalCancel(){

    this.modalRef = this.modalService.open(this.VerifyErrorModal);
    this.resetData();
  }

  public errorModalConfirm(){

    this.modalConfirmStatus = true;
    this.modalConfirmText = "验证中，请稍后";

    if(this.errorContext.isDuplicate){

      let psw = this.encrypt(this.mappingPsw);

      let result = new UpdateMappingInfo(this.userData.id, this.selectedMappingData.sysId, this.mappingAccount, psw);

      this.ccContext.UserRepository.UpdateMappingForce(result)
          .subscribe(
            (result) => {

              this.resetData();
              this.modalRef.close();

              this.modalConfirmStatus = false;
              this.modalConfirmText = "确定";
            },
            (error) => {

              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }
              
              this.resetData();
              this.modalRef.close();
              this.modalConfirmStatus = false;
              this.modalConfirmText = "确定";
            }
          );

    }
    else{

      this.resetData();
    }

  }

  public save(){

    this.loader.preloaderShow();

    let psw = this.encrypt(this.mappingPsw);

    let result = new UpdateMappingInfo(this.userData.id, this.selectedMappingData.sysId, this.mappingAccount, psw);

    this.ccContext.UserRepository.UpdateMapping(result)
        .subscribe(
          (result) => {

            this.resetData();
            this.loader.preloaderHide();
          },
          (error) => {

            this.loader.preloaderHide();

            if(error.status == 405){

              this.errorContext = new ErrorContext("产品使用者已被归户", "此产品使用者已归户到其他用户身上，是否继续并删除另外一个用户的归户关系");
              this.errorContext.isDuplicate = true;

              this.modalRef = this.modalService.open(this.VerifyErrorModal);
            }
            else{ 

              if(error._body == "產品使用者驗證失敗，無法歸戶"){

                this.errorContext = new ErrorContext("验证失败", "请再次确认帐号密码是否输入正确");
                this.errorContext.isDuplicate = false;

                this.modalRef = this.modalService.open(this.VerifyErrorModal);
              }
              else{

                if(error._body != ""){
                  window.alert(JSON.parse(error._body).message);
                }
                else{
                  window.alert(error.statusText);
                }

                this.resetData();
              };
            }
          }
        );
  }

  public cancel(){

    this.pageStatus = "normal";
    this.contentTopService.ChangeStatus("normal");
    this.EnvironmentSetting();
  }
  

  // Setting
  private EventSetting(){
    this.editMappingSettingEvent = "editMappingSettingEvent";
    this.saveMappingEvent = "saveMappingEvent";
    this.cancelMappingEvent = "cancelMappingEvent";

    this.contentTopService.CancelEventNameSetting(this.cancelMappingEvent);
    this.contentTopService.SaveEventNameSetting(this.saveMappingEvent);
  }

  private EnvironmentSetting() {

    this.contentTopService.ChangeStatus('normal');
    this.pannelEnvironment = []
    this.pannelEnvironment.push(new ButtonSetting('editMappingSetting', '编辑归户', 'btn-primary-custom', this.editMappingSettingEvent, false));

    this.mappingData.forEach(
      (data) =>{

        data.checked = false;
      }
    );

    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };

  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      switch (eventName) {
        case this.editMappingSettingEvent:
          
          this.contentTopService.EnvironmentSetting([]);
          this.contentTopService.ChangeStatus("edit");
          this.pageStatus = "editted";
          break;
        case this.saveMappingEvent:

          let isSave:boolean = false;

          this.mappingData.forEach(
            (data) => {

              if(data.checked){

                isSave = true;
              }
            }
          );

          if(isSave){
            this.save();
          }
          else{
            this.cancel();
          }
          break;
        case this.cancelMappingEvent:
          
          this.cancel();
          break;
      }
    });
  };


  // function method
  private encrypt(psw:string){

    let key = Crypto.enc.Utf8.parse("e6790158ea9648fcab7fbfc4c232cfc3");
    let iv = Crypto.enc.Utf8.parse("e6790158ea9648fc");

    let result = Crypto.AES.encrypt(psw, key, {iv: iv, mode: Crypto.mode.ECB, padding: Crypto.pad.Pkcs7});

    return result.toString();
  };

  private resetData(){

    this.ccContext.UserRepository.GetUserMapping(this.userData.id)
        .subscribe(
          (result) => {

            this.mappingData = result;
            
            if(this.mappingData.length < 1){
              this.isMapping = false;
            }

            this.selectedMappingData = this.mappingData[0];

            this.pageStatus = "normal";
            this.contentTopService.ChangeStatus("normal");
            this.EnvironmentSetting();
          }
        );
  }
  
}


class ErrorContext{

  public errorType:string;
  public errorMessage:string;
  public isDuplicate: boolean = false;

  constructor(_type:string, _message:string){

    this.errorType = _type;
    this.errorMessage = _message;
  }
}