import { Component, ViewEncapsulation, ViewChild, Input, AfterViewInit, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Tab } from "../../../../domain/Tab";
import { RoleInfo } from "../../../../domain/RoleInfo";
import { UserInfo } from "../../../../domain/UserInfo";
import { BasicMetadata } from '../../../../domain/BasicMetadata';
import { DataPolicy, UpdatedDataPolicy, UpdatedPolicyStatement, PolicyStatement, UpdatedAttachment, ServeOrg, TargetOrg, TargetOrgTag, AffectedOrgType, UpdatedStatementInfo, RequestedOrgTreeBody } from "../../../../domain/DataPolicy";
import { ConditionInfo } from "../../../authTree/domain/conditoinInfo";
import { AppPermission } from "../../../authTree/domain/appPermission";
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { OrgAspect, OrgInfo, OrgTagTreeData, OrgTag } from "../../../../domain/OrgInfo";

import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { CCContext } from "../../../../domain/CCContext";
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";


@Component({
  selector: 'DataPolicy',
  styleUrls: [('./dataPolicy.scss')],
  templateUrl: './dataPolicy.html'
})
export class DataPolicyComponent {

  @Input() roleInfo:RoleInfo = new RoleInfo("", "", "", 0, "", "");
  @Input() userInfo:UserInfo = new UserInfo("", "", "");
  @Input() sourceDataPolicy: DataPolicy[] = [];
  @Input() tabInfo: Tab;

  @ViewChild('NewPolicyModal') public NewPolicyModal;
  @ViewChild('EditPolicyModal') public EditPolicyModal;
  @ViewChild('SaveModal') public SaveModal;
  @ViewChild('PreviewModal') public PreviewModal;

  @Output() sourceDataPolicyChange:EventEmitter<any> = new EventEmitter<any>();
  
  public modalRef:NgbModalRef;

  public orgCatalogList:BasicMetadata[] = [];
  public selectedOrgCatalog:string = '';
  public selectedCatalogType:string = '';
  public orgAspectList:OrgAspect[] = [];
  public selectedOrgAspect:string = '';
  public orgTreeData:TreeData[] = [];
  public orgTypeTreeData:TreeData[] = [];
  public orgList:OrgInfo[] = [];
  public orgTagTreeData:OrgTagTreeData[] = [];

  public selectedPolicy: DataPolicy = new DataPolicy();

  public backupTargetOrg: TargetOrg[] = [];
  public backupTargetOrgTag: TargetOrgTag[] = [];
  public backupAffectedOrgType: AffectedOrgType[] = [];
  public removeOrgList: TargetOrg[] = [];
  public removeOrgTagList: TargetOrgTag[] = [];

  public modalConfirmStatus: boolean = false;
  public modalDeleteStatus:boolean = false;
  public modalConfirmText: string = "确定";
  public modalDeleteText: string = '删除';
  public modalPolicyId: string = '';
  public modalPolicyName: string = '';
  public newStartDateTime: string = '';
  public newEndDateTime: string = '';
  public editStartDateTime: string = '';
  public editEndDateTime: string = '';

  public isEditStatement: boolean = false;
  public isTargetOrgEdit: boolean = false;
  public isTargetOrgTagEdit: boolean = false;
  public isAffectedOrgTypeEdit: boolean = false;

  public isBackToEdit: boolean = false;

  public nowDateTime:string = new Date().toISOString().slice(0, 16);

  ngAfterViewInit(){

  }

  constructor(private ccContext:CCContext,
              private router:Router,
              private contentTopService: ContentTopService,
              private preloader: BaThemeSpinner,
              private transfer: TreeDataTransferService, 
              private treeEvent: TreeEventService,
              private zone:NgZone,
              private modalService: NgbModal) {
    
    this.EnvironmentStart();
    this.removeOrgList = [];
    this.removeOrgTagList = [];
  }


  // Modal Mehtod
  public newPolicyModalOpen(){

    this.modalPolicyId = '';
    this.modalPolicyName = '';
    this.newStartDateTime = '';
    this.newEndDateTime = '';

    this.modalRef = this.modalService.open(this.NewPolicyModal);
  }

  public newPolicyModalConfirm(){

    let result = new UpdatedDataPolicy("", this.modalPolicyName);
    result.effectiveTime = this.newStartDateTime;
    result.expiredTime = this.newEndDateTime;    

    this.modalConfirmStatus = true;
    this.modalConfirmText = "新增中请稍后";

    if(this.tabInfo.id == 'RoleDataPolicy'){
      result.attachment = new UpdatedAttachment('role', this.roleInfo.id);
      console.log(result);

      this.ccContext.AuthRepository.UpdatePolicy(result)
          .subscribe(
            (result) => {

              this.ccContext.AuthRepository.GetRoleDataPolicy(this.roleInfo.id)
                  .subscribe(
                    (result) => {
                      
                      this.sourceDataPolicy = result;
                      this.sourceDataPolicy.forEach(
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
                      this.sourceDataPolicyChange.emit(this.sourceDataPolicy);

                      this.modalConfirmStatus = false;
                      this.modalConfirmText = "确定";
                      this.modalRef.close();
                    }
                  )
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
              this.modalRef.close();
            }
          );
    }

    if(this.tabInfo.id == 'UserDataPolicy'){
      result.attachment = new UpdatedAttachment('user', this.userInfo.id); 
      console.log(result);     

      this.ccContext.AuthRepository.UpdatePolicy(result)
          .subscribe(
            (result) => {

              this.ccContext.AuthRepository.GetUserDataPolicy(this.userInfo.id)
                  .subscribe(
                    (result) => {
                      
                      this.sourceDataPolicy = result;
                      this.sourceDataPolicy.forEach(
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
                      this.sourceDataPolicyChange.emit(this.sourceDataPolicy);

                      this.modalConfirmStatus = false;
                      this.modalConfirmText = "确定";
                      this.modalRef.close();
                    }
                  )
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
              this.modalRef.close();
            }
          );
    }
  }

  public editPolicyModalOpen(target:DataPolicy){

    this.selectedPolicy = target;

    this.modalPolicyName = this.selectedPolicy.name;
    this.modalPolicyId = this.selectedPolicy.id;
    this.editStartDateTime = this.selectedPolicy.effectiveTime;
    this.editEndDateTime = this.selectedPolicy.expiredTime;

    this.modalRef = this.modalService.open(this.EditPolicyModal);
  }

  public editPolicyModalConfirm(){

    let result = new UpdatedDataPolicy(this.modalPolicyId, this.modalPolicyName);
    result.effectiveTime = this.editStartDateTime;
    result.expiredTime = this.editEndDateTime;    
    result.hash = this.selectedPolicy.hash;

    

    this.modalConfirmStatus = true;
    this.modalConfirmText = "新增中请稍后";

    if(this.tabInfo.id == 'RoleDataPolicy'){
      result.attachment = new UpdatedAttachment('role', this.roleInfo.id);
      console.log(result);

      this.ccContext.AuthRepository.UpdatePolicy(result)
          .subscribe(
            (result) => {

              this.ccContext.AuthRepository.GetRoleDataPolicy(this.roleInfo.id)
                  .subscribe(
                    (result) => {
                      
                      this.sourceDataPolicy = result;
                      this.sourceDataPolicy.forEach(
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
                      this.sourceDataPolicyChange.emit(this.sourceDataPolicy);

                      this.modalConfirmStatus = false;
                      this.modalConfirmText = "确定";
                      this.modalRef.close();
                    }
                  )
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
              this.modalRef.close();
            }
          );
    }

    if(this.tabInfo.id == 'UserDataPolicy'){
      result.attachment = new UpdatedAttachment('user', this.userInfo.id);
      console.log(result);

      this.ccContext.AuthRepository.UpdatePolicy(result)
          .subscribe(
            (result) => {

              this.ccContext.AuthRepository.GetUserDataPolicy(this.userInfo.id)
                  .subscribe(
                    (result) => {
                      
                      this.sourceDataPolicy = result;
                      this.sourceDataPolicy.forEach(
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
                      this.sourceDataPolicyChange.emit(this.sourceDataPolicy);

                      this.modalConfirmStatus = false;
                      this.modalConfirmText = "确定";
                      this.modalRef.close();
                    }
                  )
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
              this.modalRef.close();
            }
          );
    }
  }

  public disabledPolicy(){

    let result = new UpdatedDataPolicy(this.modalPolicyId, this.modalPolicyName);
    result.effectiveTime = this.editStartDateTime;
    result.expiredTime = this.editEndDateTime;
    result.hash = this.selectedPolicy.hash;

    this.modalDeleteStatus = true;
    this.modalDeleteText = "删除中请稍后";

    if(this.tabInfo.id == 'RoleDataPolicy'){
      result.attachment = new UpdatedAttachment('role', this.roleInfo.id);
      console.log(result);
      
      this.ccContext.AuthRepository.DisabledPolicy(result)
          .subscribe(
            (result) => {

              this.ccContext.AuthRepository.GetRoleDataPolicy(this.roleInfo.id)
                  .subscribe(
                    (result) => {
                      
                      console.log(result);
                      this.sourceDataPolicy = result;
                      this.sourceDataPolicy.forEach(
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
                      this.sourceDataPolicyChange.emit(this.sourceDataPolicy);

                      this.modalDeleteStatus = false;
                      this.modalDeleteText = "删除";
                      this.modalRef.close();
                    }
                  )
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }

              this.modalDeleteStatus = false;
              this.modalDeleteText = "删除";
              this.modalRef.close();
            }
          )
    }

    if(this.tabInfo.id == 'UserDataPolicy'){
      result.attachment = new UpdatedAttachment('user', this.userInfo.id);
      console.log(result);
      
      this.ccContext.AuthRepository.DisabledPolicy(result)
          .subscribe(
            (result) => {

              this.ccContext.AuthRepository.GetUserDataPolicy(this.userInfo.id)
                  .subscribe(
                    (result) => {
                      
                      console.log(result);
                      this.sourceDataPolicy = result;
                      this.sourceDataPolicy.forEach(
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
                      this.sourceDataPolicyChange.emit(this.sourceDataPolicy);

                      this.modalDeleteStatus = false;
                      this.modalDeleteText = "删除";
                      this.modalRef.close();
                    }
                  )
            },
            (error) => {
              if(error._body != ""){
                window.alert(JSON.parse(error._body).message);
              }
              else{
                window.alert(error.statusText);
              }

              this.modalDeleteStatus = false;
              this.modalDeleteText = "删除";
              this.modalRef.close();
            }
          )
    }
  }


  // Binding Method
  public editStatement(targetPolicy:DataPolicy){

    this.isEditStatement = true;

    this.selectedPolicy = JSON.parse(JSON.stringify(targetPolicy));
    
    this.preloader.preloaderShow();

    let attachment:UpdatedAttachment;
    if(this.tabInfo.id == 'RoleDataPolicy') attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') attachment = new UpdatedAttachment('user', this.userInfo.id);
    const requestBody = new RequestedOrgTreeBody(this.selectedPolicy.id, attachment);

    this.ccContext.OrganizationRepository.GetAllOrgCatalog()
        .subscribe(
          (result) => {

            this.orgCatalogList = result;

            if(this.orgCatalogList.length > 0){

                this.selectedOrgCatalog = result[0].id;
                requestBody.orgCatalogId = result[0].id;

                this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
                    .subscribe(
                      (aspect:OrgAspect[]) => {

                        this.orgAspectList = aspect;

                        if(this.orgAspectList.length > 0){

                          this.selectedOrgAspect = this.orgAspectList[0].id;
                          requestBody.orgAspectId = this.orgAspectList[0].id;
                          
                          this.ccContext.OrganizationRepository.GetOrgTreeByPolicy(requestBody)
                              .subscribe(
                                (result) =>{

                                  this.orgList = result;
                                  this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);
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
                              )
                        };
                      }
                    );
              };
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

    this.ccContext.OrganizationRepository.GetOrgTagTreeByPolicy(requestBody)
        .subscribe(
          (result: OrgTag[]) => {

            this.orgTagTreeData = [];
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

                this.orgTagTreeData.push(target);
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
  }

  public backToPolicy(){

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

  public backToEdit(){

    this.isBackToEdit = true;

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

  public editStatementSave(){

    var result = new UpdatedDataPolicy(this.selectedPolicy.id, this.selectedPolicy.name);
    result.hash = this.selectedPolicy.hash;
    result.userInOrg = this.selectedPolicy.userInOrg;

    if(this.tabInfo.id == 'RoleDataPolicy') result.attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') result.attachment = new UpdatedAttachment('user', this.userInfo.id);

    let targetOrgs:UpdatedStatementInfo[] = [];
    this.selectedPolicy.targetOrgs.forEach(
      (item) => {

        let target = new UpdatedStatementInfo();
        target.uri = item.uri;
        target.effect = item.effect;
        targetOrgs.push(target);
      }
    );
    result.targetOrgs = targetOrgs;

    let targetOrgTags:UpdatedStatementInfo[] = [];
    this.selectedPolicy.targetOrgTags.forEach(
      (item) => {

        let target = new UpdatedStatementInfo();
        target.id = item.id;
        target.effect = item.effect;
        targetOrgTags.push(target);
      }
    );
    result.targetOrgTags = targetOrgTags;
  
    console.log(result);

    this.preloader.preloaderShow();
    this.ccContext.AuthRepository.UpdatePolicyContent(result)
        .subscribe(
          (result) => {

            this.isEditStatement = false;
            this.isAffectedOrgTypeEdit = false;
            this.isTargetOrgEdit = false;
            this.isTargetOrgTagEdit = false;

            if(this.tabInfo.id == 'RoleDataPolicy'){

              this.ccContext.AuthRepository.GetRoleDataPolicy(this.roleInfo.id)
                  .subscribe(
                    (result) => {
        
                      this.sourceDataPolicy = result;
        
                      this.sourceDataPolicy.forEach(
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
        
                      this.preloader.preloaderHide();
                    },
                    (error) => {
        
                      this.preloader.preloaderHide();
                    }
                  );
            }

            if(this.tabInfo.id == 'UserDataPolicy'){

              this.ccContext.AuthRepository.GetUserDataPolicy(this.userInfo.id)
                  .subscribe(
                    (result) => {
        
                      this.sourceDataPolicy = result;
        
                      this.sourceDataPolicy.forEach(
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
        
                      this.preloader.preloaderHide();
                    },
                    (error) => {
        
                      this.preloader.preloaderHide();
                    }
                  );
            }

            this.removeOrgList = [];
            this.removeOrgTagList = [];
          },
          (error) =>{
            if(error._body != ""){
              window.alert(JSON.parse(error._body).message);
            }
            else{
              window.alert(error.statusText);
            }

            this.preloader.preloaderHide();
          }
        );

    
  }

  public exitThisPage(){

    this.modalRef.close();

    if(this.isBackToEdit){

      this.isTargetOrgEdit = false;
      this.isTargetOrgTagEdit = false;
      this.isAffectedOrgTypeEdit = false;

      this.isBackToEdit = false;
    }
    else if(this.isEditStatement){

      this.isTargetOrgEdit = false;
      this.isTargetOrgTagEdit = false;
      this.isAffectedOrgTypeEdit = false;
      this.isEditStatement = false;
      
      this.contentTopService.SetBackLastCustom(true);
    }
    else{
      this.contentTopService.notifyDataChanged('button.trigger', 'backToLastPage');
    }

    this.removeOrgList = [];
    this.removeOrgTagList = [];
  }

  public editTargetOrg(){

    this.isTargetOrgEdit = true;
    this.isTargetOrgTagEdit = false;
    this.backupTargetOrg = JSON.parse(JSON.stringify(this.selectedPolicy.targetOrgs));

    this.zone.runOutsideAngular(
      () => {
        this.removeOrgList.forEach(
          (org) => {

            this.setOrgTreeEleChecked(org.uri, false);
          }
        )
      }
    );
  }

  public editTargetOrgTag(){

    this.isTargetOrgTagEdit = true;
    this.isTargetOrgEdit = false;
    this.backupTargetOrgTag = JSON.parse(JSON.stringify(this.selectedPolicy.targetOrgTags));

    this.zone.runOutsideAngular(
      () => {
        this.removeOrgTagList.forEach(
          (org) => {

            this.setOrgTagTreeEleChecked(org.id, false);
          }
        )
      }
    );
  }

  public updateToSelected(){

    if(this.isTargetOrgEdit){
      this.selectedPolicy.targetOrgs = JSON.parse(JSON.stringify(this.backupTargetOrg));
      this.isTargetOrgEdit = false;
    }
    if(this.isTargetOrgTagEdit){
      this.selectedPolicy.targetOrgTags = JSON.parse(JSON.stringify(this.backupTargetOrgTag));
      this.isTargetOrgTagEdit = false;
    }
  }

  public previewChecked(){

    this.modalService.open(this.PreviewModal);
  }

  public editAffectedOrgTypeSave(){

    var result = new UpdatedDataPolicy(this.selectedPolicy.id, this.selectedPolicy.name);
    result.hash = this.selectedPolicy.hash;

    if(this.tabInfo.id == 'RoleDataPolicy') result.attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') result.attachment = new UpdatedAttachment('user', this.userInfo.id);

    let types:UpdatedStatementInfo[] = [];
    this.backupAffectedOrgType.forEach(
      (item) => {

        let target = new UpdatedStatementInfo();
        target.uri = item.uri;
        types.push(target);
      }
    );
    result.affectedOrgTypes = types;

    console.log(result);

    this.preloader.preloaderShow();
    this.ccContext.AuthRepository.UpdatePolicyOrgType(result)
        .subscribe(
          (result) => {

            this.isEditStatement = false;
            this.isAffectedOrgTypeEdit = false;
            this.isTargetOrgEdit = false;
            this.isTargetOrgTagEdit = false;

            if(this.tabInfo.id == 'RoleDataPolicy'){

              this.ccContext.AuthRepository.GetRoleDataPolicy(this.roleInfo.id)
                  .subscribe(
                    (result) => {
        
                      this.sourceDataPolicy = result;
        
                      this.sourceDataPolicy.forEach(
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
        
                      this.preloader.preloaderHide();
                    },
                    (error) => {
        
                      this.preloader.preloaderHide();
                    }
                  );
            }

            if(this.tabInfo.id == 'UserDataPolicy'){

              this.ccContext.AuthRepository.GetUserDataPolicy(this.userInfo.id)
                  .subscribe(
                    (result) => {
        
                      this.sourceDataPolicy = result;
        
                      this.sourceDataPolicy.forEach(
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
        
                      this.preloader.preloaderHide();
                    },
                    (error) => {
        
                      this.preloader.preloaderHide();
                    }
                  );
            }
            
            this.removeOrgList = [];
            this.removeOrgTagList = [];
          },
          (error) =>{
            if(error._body != ""){
              window.alert(JSON.parse(error._body).message);
            }
            else{
              window.alert(error.statusText);
            }

            this.preloader.preloaderHide();
          }
        );    
  }

  public editAffectedOrgType(targetPolicy:DataPolicy){

    this.preloader.preloaderShow();

    this.isEditStatement = true;
    this.isAffectedOrgTypeEdit = true;

    this.selectedPolicy = JSON.parse(JSON.stringify(targetPolicy));
    this.backupAffectedOrgType = this.selectedPolicy.affectedOrgTypes;

    let attachment:UpdatedAttachment;
    if(this.tabInfo.id == 'RoleDataPolicy') attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') attachment = new UpdatedAttachment('user', this.userInfo.id);
    const requestBody = new RequestedOrgTreeBody(this.selectedPolicy.id, attachment);

    this.ccContext.OrganizationRepository.GetAllOrgCatalog()
        .subscribe(
          (result) => {

            this.orgCatalogList = result;

            if(this.orgCatalogList.length > 0){

                this.selectedCatalogType = result[0].id;
                requestBody.orgCatalogId = result[0].id;

                this.ccContext.OrganizationRepository.GetOrgTypeTreeByPolicy(requestBody)
                    .subscribe(
                      (result) => {

                        this.orgTypeTreeData = this.transfer.TransferOrgWithOutAspect(result, true);
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
                    )
              };
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
  }

  public checkedUserInOrg(target){
    this.selectedPolicy.userInOrg.checked = target;

    if(this.selectedPolicy.userInOrg.checked){
      this.selectedPolicy.userInOrg.effect = 'self';
    }
    else{
      this.selectedPolicy.userInOrg.effect = '';
    }
  }


  // TreeEvent
  private getCheckedItem(treeData:TreeData[]): TreeData[] {
    return this.treeEvent.getCheckedItem(treeData, 'multiple');
  };

  private getTagCheckedItem(treeData:OrgTagTreeData[]): OrgTagTreeData[] {
    return this.treeEvent.getCheckedOrgInTag(treeData, 'multiple');
  };


  // Org & TreeRelate
  public selectOrgCatalog(orgCatalogId:string){

    this.preloader.preloaderShow();

    let attachment:UpdatedAttachment;
    if(this.tabInfo.id == 'RoleDataPolicy') attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') attachment = new UpdatedAttachment('user', this.userInfo.id);
    
    const requestBody = new RequestedOrgTreeBody(this.selectedPolicy.id, attachment);
    this.selectedOrgCatalog = orgCatalogId;
    requestBody.orgCatalogId = orgCatalogId;
  
    if(this.selectedOrgCatalog){

      this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
          .subscribe(
            (aspect:OrgAspect[]) => {

              this.orgAspectList = aspect;

              if(this.orgAspectList.length > 0){
                
                this.selectedOrgAspect = this.orgAspectList[0].id;
                requestBody.orgAspectId = this.orgAspectList[0].id;

                this.ccContext.OrganizationRepository.GetOrgTreeByPolicy(requestBody)
                    .subscribe(
                      (result) =>{

                        this.orgList = result;
                        this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);

                        this.zone.runOutsideAngular(
                          () => {
                            this.backupTargetOrg.forEach(
                              (org) => {
                    
                                this.setOrgTreeEleChecked(org.uri, true);
                              }
                            );
                    
                            this.removeOrgList.forEach(
                              (org) => {
                    
                                this.setOrgTreeEleChecked(org.uri, false);
                              }
                            )
                          }
                        );

                        this.preloader.preloaderHide();
                      }
                    );
              }
            }
          );
      }
  }
  
  public selectOrgAspect(orgAspectId:string){

    this.preloader.preloaderShow();

    let attachment:UpdatedAttachment;
    if(this.tabInfo.id == 'RoleDataPolicy') attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') attachment = new UpdatedAttachment('user', this.userInfo.id);

    const requestBody = new RequestedOrgTreeBody(this.selectedPolicy.id, attachment);
    this.selectedOrgAspect = orgAspectId;
    requestBody.orgCatalogId = this.selectedOrgCatalog;
    requestBody.orgAspectId = orgAspectId;

    this.ccContext.OrganizationRepository.GetOrgTreeByPolicy(requestBody)
        .subscribe(
          (result) =>{

            this.orgList = result;
            this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);

            this.zone.runOutsideAngular(
              () => {
                this.backupTargetOrg.forEach(
                  (org) => {
        
                    this.setOrgTreeEleChecked(org.uri, true);
                  }
                );
        
                this.removeOrgList.forEach(
                  (org) => {
        
                    this.setOrgTreeEleChecked(org.uri, false);
                  }
                )
              }
            );

            this.preloader.preloaderHide();
          }
        );
  }

  public removeTargetOrgData(target:TargetOrg){

    this.removeOrgList.push(target);

    this.selectedPolicy.targetOrgs.forEach(
      (item, index) => {
        
        if(item.uri== target.uri){

          this.selectedPolicy.targetOrgs.splice(index, 1);
        }
      }
    );

    this.setOrgTreeEleChecked(target.uri, false);
  }

  public orgTreeGetNotify(event: any){

    if (event == "getResult"){
      let checkedOrg = this.getCheckedItem(this.orgTreeData);
      
      checkedOrg.forEach(
        (checkedOrg, index) => {

          let isInList: boolean = false;
          this.backupTargetOrg.forEach(
            (item) => {
              
              if(item.uri == checkedOrg.orgUri){
                isInList = true;
              }
            }
          );

          if(!isInList){
            let target = new TargetOrg()
            target.effect = 'self';
            target.name = checkedOrg.name;
            target.uri = checkedOrg.orgUri;
            target.urn = checkedOrg.orgUrn;
            target.label = checkedOrg.label;

            this.backupTargetOrg.push(target);    
          };
        }
      );
    }

    if (event.eventName == "remove"){
      this.backupTargetOrg.forEach(
        (item, index) => {
          
          if(item.uri== event.target.orgUri){

            this.backupTargetOrg.splice(index, 1);
          }
        }
      );  
    }
  }

  public setOrgTreeEleChecked(orgUri:string, targetValue:boolean){
    this.zone.runOutsideAngular(
      () => {
        this.orgTreeData.forEach(
          (org) => {

            if(org.orgUri == orgUri){
              org.checked = targetValue;
              return 0;
            }
    
            if(org.child.length>0){
    
              this.orgTreeLoop(org.child, orgUri, targetValue);
            }
          }
        )
      }
    )
  }

  public orgTreeLoop(target:TreeData[], orgUri:string, targetValue:boolean){
    this.zone.runOutsideAngular(
      () => {
        target.forEach(
          (org) => {
            if(org.orgUri == orgUri){
              org.checked = targetValue;
              return 0;
            }
    
            if(org.child.length>0){
    
              this.orgTreeLoop(org.child, orgUri, targetValue);
            }
          }
        );
      }
    )
  }


  // OrgTag & TreeRelate
  public removeTargetOrgTagData(target:TargetOrgTag){
    this.removeOrgTagList.push(target);

    this.selectedPolicy.targetOrgTags.forEach(
      (item, index) => {
        
        if(item.id== target.id){

          this.selectedPolicy.targetOrgTags.splice(index, 1);
        }
      }
    );

    this.setOrgTagTreeEleChecked(target.id, false)
  }

  public orgTagTreeGetNotify(event: any){

    if (event == "getResult"){
      let checkedOrgTag = JSON.parse(JSON.stringify(this.getTagCheckedItem(this.orgTagTreeData)));
  
      checkedOrgTag.forEach(
        (orgTag, index) => {

          let isInList: boolean = false;
          this.backupTargetOrgTag.forEach(
            (item) => {
              if(item.id == orgTag.id){
                isInList = true;
              }
            }
          );

          if(!isInList){

            let target = new TargetOrgTag();
            target.effect = 'self';
            target.id = orgTag.id;
            target.name = orgTag.name;

            this.backupTargetOrgTag.push(target);
          };
        }
      );
    }

    if (event.eventName == "remove"){
      this.backupTargetOrgTag.forEach(
        (item, index) => {

          if(item.id == event.target.id){

            this.backupTargetOrgTag.splice(index, 1);
          }
        }
      );
    }
  }

  public setOrgTagTreeEleChecked(orgId:string, targetValue:boolean){
    this.orgTagTreeData.forEach(
      (orgIntag) => {

        if(orgIntag.id == orgId){
          orgIntag.checked = targetValue;
        }
      }
    )
  }


  // OrgType & TreeRelate
  public removeOrgTypeData(target:AffectedOrgType){
    this.backupAffectedOrgType.forEach(
      (item, index) => {
        
        if(item.uri== target.uri){

          this.backupAffectedOrgType.splice(index, 1);
        }
      }
    );

    this.setOrgTypeTreeEleChecked(target.uri, false)
  }

  public setOrgTypeTreeEleChecked(orgUri:string, targetValue:boolean){
    this.zone.runOutsideAngular(
      () => {
        this.orgTypeTreeData.forEach(
          (org) => {

            if(org.orgUri == orgUri){
              org.checked = targetValue;
              return 0;
            }
    
            if(org.child.length>0){
    
              this.orgTypeTreeLoop(org.child, orgUri, targetValue);
            }
          }
        )
      }
    )
  }

  public orgTypeTreeLoop(target:TreeData[], orgUri:string, targetValue:boolean){
    this.zone.runOutsideAngular(
      () => {
        target.forEach(
          (org) => {
    
            if(org.orgUri == orgUri){
              org.checked = targetValue;
              return 0;
            }
    
            if(org.child.length>0){
    
              this.orgTypeTreeLoop(org.child, orgUri, targetValue);
            }
          }
        );
      }
    )
  }

  public selectTypeOrgCatalog(orgCatalogId:string){

    this.preloader.preloaderShow();

    let attachment:UpdatedAttachment;
    if(this.tabInfo.id == 'RoleDataPolicy') attachment = new UpdatedAttachment('role', this.roleInfo.id);
    if(this.tabInfo.id == 'UserDataPolicy') attachment = new UpdatedAttachment('user', this.userInfo.id);
    const requestBody = new RequestedOrgTreeBody(this.selectedPolicy.id, attachment);
    this.selectedCatalogType = orgCatalogId;
    requestBody.orgCatalogId = this.selectedCatalogType;
    
  
    if(this.selectedCatalogType){

      this.ccContext.OrganizationRepository.GetOrgTypeTreeByPolicy(requestBody)
          .subscribe(
            (result) => {

              this.orgTypeTreeData = this.transfer.TransferOrgWithOutAspect(result, true);
              this.preloader.preloaderHide();

              this.zone.runOutsideAngular(
                () => {

                  this.backupAffectedOrgType.forEach(
                    (orgType) => {

                      this.setOrgTypeTreeEleChecked(orgType.uri, true);
                    }
                  );
                }
              );
            }
          )
      }
  }

  public orgTypeTreeGetNotify(event: any){
    if (event == "getResult"){
      let checkedOrg = this.getCheckedItem(this.orgTypeTreeData);
      
      checkedOrg.forEach(
        (checkedOrg, index) => {

          let isInList: boolean = false;
          this.backupAffectedOrgType.forEach(
            (item) => {
              
              if(item.uri == checkedOrg.orgUri){
                isInList = true;
              }
            }
          );

          if(!isInList){
            let target = new AffectedOrgType()
            target.name = checkedOrg.name;
            target.id = checkedOrg.label;
            target.uri = checkedOrg.orgUri;

            this.backupAffectedOrgType.push(target);    
          };
        }
      );
    }

    if (event.eventName == "remove"){
      this.backupAffectedOrgType.forEach(
        (item, index) => {
          
          if(item.uri== event.target.orgUri){

            this.backupAffectedOrgType.splice(index, 1);
          }
        }
      );
    }
  }
  

  // Environment
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      if(eventName == 'contentTop.backCustom'){

        if(this.tabInfo.isFocus){

          if(this.isEditStatement){

            this.backToPolicy();
          }
          else{

            this.contentTopService.notifyDataChanged('button.trigger', 'backToLastPage');
          }
        }


        this.removeOrgList = [];
        this.removeOrgTagList = [];
      }
    });
  };
}
