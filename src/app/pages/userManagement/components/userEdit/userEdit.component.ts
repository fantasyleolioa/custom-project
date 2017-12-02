import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { UserMetadata, UserMetadataColum } from '../../../../domain/UserMetadata';
import { BasicMetadata } from "../../../../domain/BasicMetadata";
import { OrgInfo, OrgAspect, OrgTag, OrgTagTreeData } from "../../../../domain/OrgInfo";
import { Tab } from "../../../../domain/Tab";

import { CCContext } from "../../../../domain/CCContext";
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";

import * as Crypto from 'crypto-js';

@Component({
  selector: 'UserEdit',
  styleUrls: ['./userEdit.scss'],
  templateUrl: './userEdit.html'
})
export class UserEdit implements AfterViewInit {

  // Properties
  public orgCatalogList: BasicMetadata[] = [];
  public selectedOrgCatalog:string = "";
  public orgAspectList: OrgAspect[] =[];
  public selectedOrgAspect: string = "";
  public orgList: OrgInfo[] = [];
  public userInOrgList: UserInOrgList[] = [];
  public orgTreeData: TreeData[] = [];  
  public orgTagList: OrgTagTreeData[] = [];
  public userInOrgTagList: OrgTagTreeData[] = [];

  public pannelEnvironment: ButtonSetting[] = [];
  public editStatus: string = "multiple";

  public roleDataList: TreeData[] = [];
  public roleIdList:string[] = [];
  public selectedRoleList:RoleTable[] = [];
  
  public userMetadata: UserMetaDataColumInfo[] = [];

  public updatedPsw:string = "";
  public confirmPsw:string = "";

  public userId:string = "";
  public userName:string = "";
  public userHash:string = "";
  public disabledCause:string = ""

  public tabList:Tab[] = [];

  public modalConfirmStatus: boolean = false;
  public modalConfirmText: string = "确定";
  public promptText: string = "";

  public saveEvent:string = "";
  public userEditditPswEvent:string = "";
  public disableUserEvent:string = "";

  private modalRef:NgbModalRef;

  @ViewChild('PasswordModal') public PasswordModal;
  @ViewChild('DisabledModal') public DisabledModal;
  @ViewChild('SaveModal') public SaveModal;

  ngAfterViewInit() {
    this.preloader.preloaderShow();
  };

  // Constructor
  constructor(private ccContext:CCContext,  
              private contentTopService: ContentTopService, 
              private router: Router, 
              private transfer: TreeDataTransferService, 
              private treeEvent: TreeEventService,
              private preloader:BaThemeSpinner,
              private modalService:NgbModal,) 
  { 
    this.contentTopService.clearSubscribe("button.trigger");
    
    this.tabList.push(new Tab(true, '用户资讯', 'userInfo'));
    this.tabList.push(new Tab(false, '归属角色', 'uesrInRole'));
    this.tabList.push(new Tab(false, '隶属组织', 'userInOrg'));
    this.tabList.push(new Tab(false, '负责片区', 'userInOrgTag'));

    let edittedUserId = window.sessionStorage.getItem("EdittedUserId");

    if(edittedUserId){
      this.ccContext.UserRepository.GetUserById(edittedUserId)  
          .subscribe(
            (result) => {

              this.userName = result.name;
              this.userId = result.id;
              this.userHash = result.hash;

              let title = this.userName + '(' + this.userId + ')';
              
              this.contentTopService.TitleSetting(title);
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );
      
      this.ccContext.UserRepository.GetUserInOrgTag(edittedUserId)
          .subscribe(
            (result) => {

              if(result.length > 0){
                result.forEach(
                  (orgTag, orgTagIndex) => {
                    
                    let target = new OrgTagTreeData(orgTag.sid, orgTag.tagId, orgTag.tagName, orgTag.hash);
                    target.backgroundColor = orgTag.backgroundColor;
                    target.foregroundColor = orgTag.foregroundColor;
                    target.subCollapsed = true;
    
    
                    orgTag.org.forEach(
                      (orgInOrgTag) => {
    
                        let orgInTagTarget = new OrgTagTreeData(orgInOrgTag.orgSid, '', '', '');
                        orgInTagTarget.orgType = orgInOrgTag.typeName;
                        orgInTagTarget.id = orgInOrgTag.orgLabel;
                        orgInTagTarget.name = orgInOrgTag.orgName;
    
                        target.child.push(orgInTagTarget);
                      }
                    );
    
                    this.userInOrgTagList.push(target);
                  }
                );

              }
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.RoleRepository.GetRoleSourceTree(edittedUserId)
          .subscribe(
            (result) => {

              this.roleDataList = this.transfer.TransferRole(result);

              if(this.getCheckedItem(this.roleDataList).length > 0){
                
                let target = this.getCheckedItem(this.roleDataList);
        
                target.forEach(
                  (item) => {
                    
                    this.roleIdList.push(item.id);
                    this.selectedRoleList.push(new RoleTable(item.catalogId, item.roleCatalogName, item.id, item.name));
                  }
                );
              }
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.UserRepository.GetUserInOrg(edittedUserId)
          .subscribe(
            (result) => {

              result.forEach(
                (item) => {

                  let target = new UserInOrgList(item.orgSid, "[empty]", "[empty]", item.priority, item.hash);
                  target.orgType = item.orgTypeName;
                  target.orgTypeUri = item.orgTypeUri;
                  target.orgUrn = item.orgUrn;
                  target.orgUri = item.orgUri;
                  target.name = item.orgName;
                  target.orgLabel = item.orgLabel;
                  target.isDefault = item.isDefault;

                  this.userInOrgList.push(target)
                }
              );

              this.userInOrgList.sort(
                function(a, b){
                  return a.priority - b.priority;
                }
              );

            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.OrganizationRepository.GetAllOrgCatalog()
          .subscribe(
            (result:BasicMetadata[]) => {

              this.orgCatalogList = result;

              if(this.orgCatalogList.length > 0){

                this.selectedOrgCatalog = result[0].id;

                this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
                    .subscribe(
                      (aspect:OrgAspect[]) => {

                        this.orgAspectList = aspect;

                        if(this.orgAspectList.length > 0){

                          this.selectedOrgAspect = this.orgAspectList[0].id;
                          
                          this.ccContext.OrganizationRepository.GetOrgSourceTree(this.selectedOrgCatalog, this.selectedOrgAspect, this.userId)
                              .subscribe(
                                (result) => {

                                  this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);
                                },
                                (error) => {
                                  if(error._body != ""){
                                    this.promptText = JSON.parse(error._body).message;
                                  }
                                  else{
                                    this.promptText = error.statusText;
                                  }
                                  
                                  this.preloader.preloaderHide();
                                  this.contentTopService.ChangeStatus("edit");
                                }
                              );

                        };
                      },
                      (error) => {
                        if(error._body != ""){
                          this.promptText = JSON.parse(error._body).message;
                        }
                        else{
                          this.promptText = error.statusText;
                        }
                        
                        this.preloader.preloaderHide();
                        this.contentTopService.ChangeStatus("edit");
                      }
                    );
              };
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.OrganizationRepository.GetAllOrgTagChecked(edittedUserId)
          .subscribe(
            (result: OrgTag[]) => {
  
              result.forEach(
                (orgTag, orgTagIndex) => {
  
                  let target = new OrgTagTreeData(orgTag.sid, orgTag.id, orgTag.name, orgTag.hash);
                  target.backgroundColor = orgTag.backgroundColor;
                  target.foregroundColor = orgTag.foregroundColor;
                  target.subCollapsed = true;
                  target.checked = orgTag.checked;
  
  
                  orgTag.org.forEach(
                    (orgInOrgTag) => {
  
                      let orgInTagTarget = new OrgTagTreeData(orgInOrgTag.orgSid, '', '', '');
                      orgInTagTarget.orgType = orgInOrgTag.typeName;
                      orgInTagTarget.id = orgInOrgTag.orgLabel;
                      orgInTagTarget.name = orgInOrgTag.orgName;
  
                      target.child.push(orgInTagTarget);
                    }
                  );
  
                  this.orgTagList.push(target);

                }
              );
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.UserRepository.QueryUserMetaDataColum(edittedUserId)
          .map(
            (result) => {
              let metadataInfo:UserMetaDataColumInfo[] = [];
  
              result.metadata.forEach(
                (item) => {

                  let userMetadata:Array<Array<UserMetadata>> = [];
  
                  for(let i=1; i<=Math.ceil(item.metadataColumn.length/3); i++){
                    
                    userMetadata.push([]);
      
                    for(let j=i*3-2; j<=i*3; j++){
                      
                      if(j <= item.metadataColumn.length){
      
                        item.metadataColumn[j-1].readOnly = this.checkedReadOnly(item.metadataColumn[j-1]);
                        item.metadataColumn[j-1].providerText = this.setProviderText(item.metadataColumn[j-1]);
      
                        if(item.metadataColumn[j-1].type == "single" || item.metadataColumn[j-1].type == "boolean"){
                          item.metadataColumn[j-1].value = item.metadataColumn[j-1].typeParameter[0]
                        }
      
                        userMetadata[i-1].push(item.metadataColumn[j-1]);
                      };
                    };
                  };
  
                  metadataInfo.push(new UserMetaDataColumInfo(item.catalogId, userMetadata));
                }
              );
  
              return metadataInfo;
            }
          )
          .subscribe(
            (metadataInfo:UserMetaDataColumInfo[]) => {
              
              this.userMetadata = metadataInfo;
              this.preloader.preloaderHide();
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );
      
      this.EnvironmentSetting();
      this.EnvironmentStart();
    }
    else{
      window.sessionStorage.clear();
      window.sessionStorage.setItem("redirectPage", '/pages/userManagement/userQuery');
      window.alert("需要重新登入，将导向回登入页入页");
      this.router.navigate(["/login"]);
    }
  }


  // Modal
  public disableUser() {

    this.modalRef = this.modalService.open(this.DisabledModal);
  };

  public DisabledModalConfirm() {

    this.modalConfirmStatus = true;
    this.modalConfirmText = "停用中请稍后";

    this.ccContext.UserRepository.DisableUser(this.userId, this.userHash, this.disabledCause)
        .subscribe(
          (result) => { 

            this.modalRef.close();
            this.router.navigate(['/pages/userManagement/userQuery']);
          },
          (error) => {
            if(error._body != ""){
              window.alert(JSON.parse(error._body).message);
            }
            else{
              window.alert(error.statusText);
            }
            
            this.modalConfirmStatus = false;
            this.modalConfirmText = "确定";
          }
        );
  };

  public editPsw() {
    this.updatedPsw = "";
    this.confirmPsw = "";
    
    this.modalRef = this.modalService.open(this.PasswordModal);
  };

  public PasswordModalConfirm() {

    if (this.updatedPsw == this.confirmPsw){

      let encryptedPsw =  Crypto.enc.Base64.stringify(Crypto.SHA256(Crypto.SHA256(this.updatedPsw)));
      this.modalConfirmStatus = true;
      this.modalConfirmText = "修改中请稍后";

      this.ccContext.UserRepository.UpdatePasswordForce(this.userId, this.userHash, encryptedPsw)
          .subscribe(
            (result) => {

              this.modalConfirmStatus = false;
              this.modalConfirmText = "确定";
              this.modalRef.close();
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }
              
              this.modalConfirmStatus = false;
              this.modalConfirmText = "确定";
            }
          );
    }
    else{

      window.alert("確認密碼中的內容與欲更新之密碼不一樣");
      this.updatedPsw = "";
      this.confirmPsw = "";
    }

    
  };

  public exitThisPage(){

    this.modalRef.close();
    this.router.navigate(['/pages/userManagement/userQuery']);
  }


  // PageEvent
  public save() {

    if(this.userId != "" && this.userName != ""){

      this.promptText = ""
      this.preloader.preloaderShow();

      let tagIds = [];
      this.userInOrgTagList.forEach(
        (item) => {

          tagIds.push(item.id);
        }
      );

      let updateMetadata:UpdateMetaDataColumInfo[] = [];
      this.userMetadata.forEach(
        (item) => {

          let metadata = [];

          
          item.metadataColumn.forEach(
            (colum) =>{

              metadata = metadata.concat(colum)
            }
          );

          updateMetadata.push(new UpdateMetaDataColumInfo(item.catalogId, metadata));
        }
      );

      let defaultTypeUris = [];
      this.userInOrgList.forEach(
        (item) => {

          if(item.isDefault){
            defaultTypeUris.push(item.orgUri);
          }
        }
      );


      let result = new UpdatedUserInfo(this.userId, this.userName, '', this.roleIdList, updateMetadata, this.userInOrgList, tagIds, defaultTypeUris);
      result.hash = this.userHash;

      console.log(result);
      this.ccContext.UserRepository.UpdateUser(result)
          .subscribe(
            (result) => {

              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
              this.router.navigate(['/pages/userManagement/userQuery']);
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }

              this.resetAllHash();
              this.contentTopService.ChangeStatus("edit");
            }
          );
    }else{

      this.promptText = "用户ID或用户名称未輸入"
      this.contentTopService.ChangeStatus("edit");
    }
  };


  // TreeEvent
  private getCheckedItem(treeData:TreeData[]): TreeData[] {
    return this.treeEvent.getCheckedItem(treeData, 'multiple');
  };


  // State Trigger
  private EnvironmentSetting() {

    this.disableUserEvent = "disableUserEvent";
    this.saveEvent = "userEditSave";
    this.userEditditPswEvent = "userEditPswEvent";
    this.contentTopService.SaveEventNameSetting(this.saveEvent);
    
    this.pannelEnvironment.push(new ButtonSetting('userEditditPsw', '编辑密码', 'btn-primary-normal', this.userEditditPswEvent, false));    
    this.pannelEnvironment.push(new ButtonSetting('disableUser', '停用用户', 'btn-primary-danger', this.disableUserEvent, false));

    this.contentTopService.SetBackLastCustom(true);

    this.contentTopService.ChangeStatus("edit");
    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };


  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      if (eventName == this.disableUserEvent) {
        this.disableUser();
      };

      if (eventName == this.saveEvent) {
        this.save();
      }

      if (eventName == this.userEditditPswEvent) {
        this.editPsw();
      }

      if(eventName == 'contentTop.backCustom'){
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
    });
  };

  // Private
  private checkedReadOnly(target:UserMetadata){

    let result:boolean = true;

    if(target.readOnly){

      target.provider.forEach(
        (item) => {

          if (item == "cc"){
            result = false;
          }
        }
      );
    }
    else{
      return false;
    };

    return result;
  };

  private setProviderText(target:UserMetadata){

    let result:string = "";
    
    if(target.provider.length <= 0){

      return result;
    }
    else{

      result = result + "("

      target.provider.forEach(
        (provider:string, index:number) => {

          if(index == 0){
            result = result + provider;
          }
          else{
            result = result + "、" + provider;
          }
        }
      );

      result = result + ")";
    };

    return result;
  };

  private resetAllHash(){

    let edittedUserId = window.sessionStorage.getItem("EdittedUserId");

    if(edittedUserId){
      this.ccContext.UserRepository.GetUserById(edittedUserId)  
          .subscribe(
            (result) => {

              this.userName = result.name;
              this.userId = result.id;
              this.userHash = result.hash;

              let title = this.userName + '(' + this.userId + ')';
              
              this.contentTopService.TitleSetting(title);
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );
      
      this.ccContext.UserRepository.GetUserInOrgTag(edittedUserId)
          .subscribe(
            (result) => {

              if(result.length > 0){
                result.forEach(
                  (orgTag, orgTagIndex) => {

                    let target = new OrgTagTreeData(orgTag.sid, orgTag.tagId, orgTag.tagName, orgTag.hash);
                    target.backgroundColor = orgTag.backgroundColor;
                    target.foregroundColor = orgTag.foregroundColor;
                    target.subCollapsed = true;


                    orgTag.org.forEach(
                      (orgInOrgTag) => {

                        let orgInTagTarget = new OrgTagTreeData(orgInOrgTag.orgSid, '', '', '');
                        orgInTagTarget.orgType = orgInOrgTag.typeName;
                        orgInTagTarget.id = orgInOrgTag.orgLabel;
                        orgInTagTarget.name = orgInOrgTag.orgName;

                        target.child.push(orgInTagTarget);
                      }
                    );

                    this.userInOrgTagList.push(target);
                  }
                );

              }
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.RoleRepository.GetRoleSourceTree(edittedUserId)
          .subscribe(
            (result) => {

              this.roleDataList = this.transfer.TransferRole(result);

              if(this.getCheckedItem(this.roleDataList).length > 0){
                
                let target = this.getCheckedItem(this.roleDataList);
        
                target.forEach(
                  (item) => {
        
                    this.selectedRoleList.push(new RoleTable(item.catalogId, item.roleCatalogName, item.id, item.name));
                  }
                );
              }
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.UserRepository.GetUserInOrg(edittedUserId)
          .subscribe(
            (result) => {

              result.forEach(
                (item) => {

                  let target = new UserInOrgList(item.orgSid, "[empty]", "[empty]", item.priority, item.hash);
                  target.orgType = item.orgTypeName;
                  target.orgTypeUri = item.orgTypeUri;
                  target.orgUrn = item.orgUrn;
                  target.orgUri = item.orgUri;
                  target.name = item.orgName;
                  target.orgLabel = item.orgLabel;
                  target.isDefault = item.isDefault;

                  this.userInOrgList.push(target)
                }
              );

              this.userInOrgList.sort(
                function(a, b){
                  return a.priority - b.priority;
                }
              );

            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.OrganizationRepository.GetAllOrgCatalog()
          .subscribe(
            (result:BasicMetadata[]) => {

              this.orgCatalogList = result;

              if(this.orgCatalogList.length > 0){

                this.selectedOrgCatalog = result[0].id;

                this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
                    .subscribe(
                      (aspect:OrgAspect[]) => {

                        this.orgAspectList = aspect;

                        if(this.orgAspectList.length > 0){

                          this.selectedOrgAspect = this.orgAspectList[0].id;
                          
                          this.ccContext.OrganizationRepository.GetOrgSourceTree(this.selectedOrgCatalog, this.selectedOrgAspect, this.userId)
                              .subscribe(
                                (result) => {

                                  this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);                                  
                                },
                                (error) => {
                                  if(error._body != ""){
                                    this.promptText = JSON.parse(error._body).message;
                                  }
                                  else{
                                    this.promptText = error.statusText;
                                  }
                                  
                                  this.preloader.preloaderHide();
                                  this.contentTopService.ChangeStatus("edit");
                                }
                              );

                        };
                      },
                      (error) => {
                        if(error._body != ""){
                          this.promptText = JSON.parse(error._body).message;
                        }
                        else{
                          this.promptText = error.statusText;
                        }
                        
                        this.preloader.preloaderHide();
                        this.contentTopService.ChangeStatus("edit");
                      }
                    );
              };
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.OrganizationRepository.GetAllOrgTagChecked(edittedUserId)
          .subscribe(
            (result: OrgTag[]) => {

              result.forEach(
                (orgTag, orgTagIndex) => {

                  let target = new OrgTagTreeData(orgTag.sid, orgTag.id, orgTag.name, orgTag.hash);
                  target.backgroundColor = orgTag.backgroundColor;
                  target.foregroundColor = orgTag.foregroundColor;
                  target.subCollapsed = true;
                  target.checked = orgTag.checked;


                  orgTag.org.forEach(
                    (orgInOrgTag) => {

                      let orgInTagTarget = new OrgTagTreeData(orgInOrgTag.orgSid, '', '', '');
                      orgInTagTarget.orgType = orgInOrgTag.typeName;
                      orgInTagTarget.id = orgInOrgTag.orgLabel;
                      orgInTagTarget.name = orgInOrgTag.orgName;

                      target.child.push(orgInTagTarget);
                    }
                  );

                  this.orgTagList.push(target);

                }
              );
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );

      this.ccContext.UserRepository.QueryUserMetaDataColum(edittedUserId)
          .map(
            (result) => {
              let metadataInfo:UserMetaDataColumInfo[] = [];

              result.metadata.forEach(
                (item) => {

                  let userMetadata:Array<Array<UserMetadata>> = [];

                  for(let i=1; i<=Math.ceil(item.metadataColumn.length/3); i++){
                    
                    userMetadata.push([]);
      
                    for(let j=i*3-2; j<=i*3; j++){
                      
                      if(j <= item.metadataColumn.length){
      
                        item.metadataColumn[j-1].readOnly = this.checkedReadOnly(item.metadataColumn[j-1]);
                        item.metadataColumn[j-1].providerText = this.setProviderText(item.metadataColumn[j-1]);
      
                        if(item.metadataColumn[j-1].type == "single" || item.metadataColumn[j-1].type == "boolean"){
                          item.metadataColumn[j-1].value = item.metadataColumn[j-1].typeParameter[0]
                        }
      
                        userMetadata[i-1].push(item.metadataColumn[j-1]);
                      };
                    };
                  };

                  metadataInfo.push(new UserMetaDataColumInfo(item.catalogId, userMetadata));
                }
              );

              return metadataInfo;
            }
          )
          .subscribe(
            (metadataInfo:UserMetaDataColumInfo[]) => {
              
              this.userMetadata = metadataInfo;
              this.preloader.preloaderHide();
            },
            (error) => {
              if(error._body != ""){
                this.promptText = JSON.parse(error._body).message;
              }
              else{
                this.promptText = error.statusText;
              }
              
              this.preloader.preloaderHide();
              this.contentTopService.ChangeStatus("edit");
            }
          );
    }
    else{
      window.sessionStorage.clear();
      window.sessionStorage.setItem("redirectPage", '/pages/userManagement/userQuery');
      window.alert("需要重新登入，将导向回登入页入页");
      this.router.navigate(["/login"]);
    }


  };

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
    
  };
}


class OrgSourceTreeData{

  orgAspect:OrgAspect[] = [];
  org:OrgInfo[] = [];
}

class UpdatedUserInOrg{

  id:string;
  userInOrgs: UserInOrgList[];

  constructor(_id:string, _userInOrgs:UserInOrgList[]){
    this.id = _id;
    this.userInOrgs = _userInOrgs;
  }
}

class UserInOrgList{
  
  name?: string
  orgId: string;
  orgUri: string;
  orgLabel: string;
  roleId: string;
  constraint: string;
  priority: number;
  hash: string;
  orgType: string;
  orgTypeUri: string;
  orgUrn: string;
  isDefault: boolean = false;

  constructor(_orgId:string, _roleId:string, _constraint:string, _priority:number, _hash:string){

    this.orgId = _orgId;
    this.roleId = _roleId;
    this.constraint = _constraint;
    this.priority = _priority;
    this.hash = _hash;
  }
}

class UpdatedUserInfo{

  public id:string;
  public name:string;
  public passwordHash:string;
  public role: string[];
  public userDefaultOrg: string[];
  public metadata: UpdateMetaDataColumInfo[];
  public userInOrg: UserInOrgList[];
  public userInTag: string[];
  public hash: string;

  constructor(_id:string, _name:string, _password:string, _role:string[], _metadata: UpdateMetaDataColumInfo[], _userInOrg: UserInOrgList[], _userInTag: string[], _userDefaultOrg: string[]){

    this.id = _id;
    this.name = _name;
    this.passwordHash = _password;
    this.role = _role;
    this.metadata = _metadata;
    this.userInOrg = _userInOrg;
    this.userInTag = _userInTag;
    this.userDefaultOrg = _userDefaultOrg;
  }
}

class UserMetaDataColumInfo{

  catalogId: string;
  metadataColumn: Array<Array<UserMetadata>>;

  constructor(_catalogId:string, _metadataColum:Array<Array<UserMetadata>>){

    this.catalogId = _catalogId;
    this.metadataColumn = _metadataColum;
  }
}

class UpdateMetaDataColumInfo{

  catalogId: string;
  metadataColumn: Array<UserMetadata>;

  constructor(_catalogId:string, _metadataColum:Array<UserMetadata>){

    this.catalogId = _catalogId;
    this.metadataColumn = _metadataColum;
  }
}

class RoleTable{
  catalogId: string;
  catalogName: string;
  roleId: string;
  roleName: string;

  constructor(_catalogId:string, _catalogName:string, _roleId:string, _roleName:string, ){

    this.catalogId = _catalogId;
    this.catalogName = _catalogName;
    this.roleId = _roleId;
    this.roleName = _roleName;
  }
}