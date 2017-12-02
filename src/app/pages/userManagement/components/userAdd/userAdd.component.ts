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

import * as Crypto from 'crypto-js'


@Component({
  selector: 'UserAdd',
  styleUrls: ['./userAdd.scss'],
  templateUrl: './userAdd.html'
})
export class UserAdd implements AfterViewInit{

  // Properties
  public userName: string = "";
  public userId: string = "";
  public password: string = "";

  public orgCatalogList: BasicMetadata[] = [];
  public selectedOrgCatalog:string = "";
  public orgAspectList: OrgAspect[] =[];
  public selectedOrgAspect: string = "";
  public orgList: OrgInfo[] = [];
  public userInOrgList: UserInOrgList[] = [];
  public orgTreeData: TreeData[] = [];  
  public orgTagList: OrgTagTreeData[] = [];
  public userInOrgTagList: OrgTagTreeData[] = [];

  public roleDataList: TreeData[] = [];
  public roleIdList:string[] = [];

  public userMetadataInfo:UserMetaDataColumInfo[] = [];

  public tabList:Tab[] = [];

  public pannelEnvironment: ButtonSetting[] = [];
  public editStatus: string = "multiple";
  public promptText: string = "";
  public saveEvent:string = "";

  public modalRef:NgbModalRef;

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
              private modalService:NgbModal,) {

    this.contentTopService.clearSubscribe("button.trigger");

    this.tabList.push(new Tab(true, '用户资讯', 'userInfo'));
    this.tabList.push(new Tab(false, '归属角色', 'uesrInRole'));
    this.tabList.push(new Tab(false, '隶属组织', 'userInOrg'));
    this.tabList.push(new Tab(false, '负责片区', 'userInOrgTag'));

    this.ccContext.RoleRepository.GetAllRole()
        .subscribe(
          (result) => {
            
            this.roleDataList = this.transfer.TransferRole(result);
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
                
              this.selectedOrgCatalog = this.orgCatalogList[0].id;

              this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
                  .subscribe(
                    (aspect:OrgAspect[]) => {

                      this.orgAspectList = aspect;

                      if(this.orgAspectList.length > 0){

                        this.selectedOrgAspect = this.orgAspectList[0].id;
                        
                        this.ccContext.OrganizationRepository.GetAllOrgByOrgAspectId(this.selectedOrgAspect)
                            .subscribe(
                              (org:OrgInfo[]) => {

                                this.orgList = org;
                                this.orgTreeData = this.transfer.TransferOrgWithOutAspect(org);
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

    this.ccContext.OrganizationRepository.GetAllOrgTag()
        .subscribe(
          (result: OrgTag[]) => {

            result.forEach(
              (orgTag, orgTagIndex) => {

                let target = new OrgTagTreeData(orgTag.sid, orgTag.id, orgTag.name, orgTag.hash);
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

    this.ccContext.UserRepository.QueryMetaDataColum()
        .map(
          (result:Array<UserMetadataColum>) => {

            let metadataInfo:UserMetaDataColumInfo[] = [];

            result.forEach(
              (item) => {
                let userMetadata:Array<Array<UserMetadata>> = [];

                for(let i=1; i<=Math.ceil(item.metadataColumn.length/3); i++){
                  
                  userMetadata.push([]);
    
                  for(let j=i*3-2; j<=i*3; j++){
                    
                    if(j <= item.metadataColumn.length){
    
                      item.metadataColumn[j-1].readOnly = this.checkedReadOnly(item.metadataColumn[j-1]);
                      item.metadataColumn[j-1].providerText = this.setProviderText(item.metadataColumn[j-1]);
    
                      if (item.metadataColumn[j-1].type == "string"){
                        item.metadataColumn[j-1].value = "";
                      }
                      else if(item.metadataColumn[j-1].type == "single" || item.metadataColumn[j-1].type == "boolean"){
                        item.metadataColumn[j-1].value = item.metadataColumn[j-1].typeParameter[0]
                      }
                      else if(item.metadataColumn[j-1].type == "time"){
                        item.metadataColumn[j-1].value = new Date().toLocaleString("zh-TW");
                      };
    
                      userMetadata[i-1].push(item.metadataColumn[j-1]);
                    };
                  };
                };

                metadataInfo.push(new UserMetaDataColumInfo(item.catalogId, userMetadata));
              }
            )

            return metadataInfo;
          }
        )
        .subscribe(
          (metadataInfo:UserMetaDataColumInfo[]) => {

            this.userMetadataInfo = metadataInfo;
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

  //Binding Method
  public cancel() {
    this.router.navigate(['/pages/userManagement/userQuery']);
  };

  public save() {

    if(this.userId != "" && this.userName != "" && this.password != ""){

      this.promptText = ""
      this.preloader.preloaderShow();
      
      let encryptedPsw =  Crypto.enc.Base64.stringify(Crypto.SHA256(Crypto.SHA256(this.password)));

      let tagIds = [];
      this.userInOrgTagList.forEach(
        (item) => {

          tagIds.push(item.id);
        }
      );

      let updateMetadata:UpdateMetaDataColumInfo[] = [];
      this.userMetadataInfo.forEach(
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


      let result = new UpdatedUserInfo(this.userId, this.userName, encryptedPsw, this.roleIdList, updateMetadata, this.userInOrgList, tagIds, defaultTypeUris);

      console.log(result);

      this.ccContext.UserRepository.AddUser(result)
          .subscribe(
            (result) => {

              this.preloader.preloaderHide();
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

      this.promptText = "用户ID或用户名称或密码未輸入"
      this.contentTopService.ChangeStatus("edit");
    }
  };

  public exitThisPage(){

    this.modalRef.close();
    this.router.navigate(['/pages/userManagement/userQuery']);
  }
  

  // State Trigger
  private EnvironmentSetting() {

    this.contentTopService.TitleSetting("用户新增");    

    this.saveEvent = "userAddSave";
    this.contentTopService.SaveEventNameSetting(this.saveEvent);

    this.contentTopService.SetBackLastCustom(true);

    this.contentTopService.ChangeStatus("edit");
    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };


  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {

      if (eventName == this.saveEvent) {
        this.save();
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

    this.ccContext.RoleRepository.GetAllRole()
        .subscribe(
          (result) => {
            
            this.roleDataList = this.transfer.TransferRole(result);
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
                
              this.selectedOrgCatalog = this.orgCatalogList[0].id;

              this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
                  .subscribe(
                    (aspect:OrgAspect[]) => {

                      this.orgAspectList = aspect;

                      if(this.orgAspectList.length > 0){

                        this.selectedOrgAspect = this.orgAspectList[0].id;
                        
                        this.ccContext.OrganizationRepository.GetAllOrgByOrgAspectId(this.selectedOrgAspect)
                            .subscribe(
                              (org:OrgInfo[]) => {

                                this.orgList = org;
                                this.orgTreeData = this.transfer.TransferOrgWithOutAspect(org);
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

    this.ccContext.OrganizationRepository.GetAllOrgTag()
        .subscribe(
          (result: OrgTag[]) => {

            result.forEach(
              (orgTag, orgTagIndex) => {

                let target = new OrgTagTreeData(orgTag.sid, orgTag.id, orgTag.name, orgTag.hash);
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

    this.ccContext.UserRepository.QueryMetaDataColum()
        .map(
          (result:Array<UserMetadataColum>) => {

            let metadataInfo:UserMetaDataColumInfo[] = [];

            result.forEach(
              (item) => {
                let userMetadata:Array<Array<UserMetadata>> = [];

                for(let i=1; i<=Math.ceil(item.metadataColumn.length/3); i++){
                  
                  userMetadata.push([]);
    
                  for(let j=i*3-2; j<=i*3; j++){
                    
                    if(j <= item.metadataColumn.length){
    
                      item.metadataColumn[j-1].readOnly = this.checkedReadOnly(item.metadataColumn[j-1]);
                      item.metadataColumn[j-1].providerText = this.setProviderText(item.metadataColumn[j-1]);
    
                      if (item.metadataColumn[j-1].type == "string"){
                        item.metadataColumn[j-1].value = "";
                      }
                      else if(item.metadataColumn[j-1].type == "single" || item.metadataColumn[j-1].type == "boolean"){
                        item.metadataColumn[j-1].value = item.metadataColumn[j-1].typeParameter[0]
                      }
                      else if(item.metadataColumn[j-1].type == "time"){
                        item.metadataColumn[j-1].value = new Date().toLocaleString("zh-TW");
                      };
    
                      userMetadata[i-1].push(item.metadataColumn[j-1]);
                    };
                  };
                };

                metadataInfo.push(new UserMetaDataColumInfo(item.catalogId, userMetadata));
              }
            )

            return metadataInfo;
          }
        )
        .subscribe(
          (metadataInfo:UserMetaDataColumInfo[]) => {

            this.userMetadataInfo = metadataInfo;
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

  constructor() { }
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

  constructor(_id:string, _name:string, _password:string, _role:string[], _metadata: UpdateMetaDataColumInfo[], _userInOrg: UserInOrgList[], _userInTag : string[], _userDefaultOrg: string[]){

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