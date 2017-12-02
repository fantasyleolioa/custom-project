import  {Component, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Tab } from '../../../../domain/Tab';
import { BasicMetadata } from "../../../../domain/BasicMetadata";
import { OrgInfo, OrgAspect } from "../../../../domain/OrgInfo";
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { CCContext } from "../../../../domain/CCContext";


@Component({
  selector: 'UserInOrg',
  styleUrls: ['./userInOrg.scss'],
  templateUrl: './userInOrg.html'
})
export class UserInOrgComponent {

    @Input() tabInfo:Tab;
    @Input() sourceUserInOrgList:UserInOrgList[] = [];
    @Input() userInOrgList:UserInOrgList[] = []; 
    @Input() orgCatalogList: BasicMetadata[] = [];
    @Input() selectedOrgCatalog: string = "";
    @Input() orgAspectList: OrgAspect[] = [];
    @Input() selectedOrgAspect: string = "";
    @Input() userId: string = '';
    @Input() orgTreeData: TreeData[] = [];

    @Input() nowPage: string = '';
    
    public editStatus: boolean = false;
      
    private modalRef:NgbModalRef;    

    public removeList: UserInOrgList[] = [];
    
    @ViewChild('PreviewModal') public PreviewModal;    

    @Output() sourceUserInOrgListChange:EventEmitter<any> = new EventEmitter<any>();

    ngAfterViewInit() {
      // this.userInOrgList = JSON.parse(JSON.stringify(this.sourceUserInOrgList));
    };

    constructor(private treeEvent: TreeEventService, 
                private transfer: TreeDataTransferService,
                private ccContext: CCContext,
                private modalService: NgbModal,
                private contentTopService: ContentTopService,
                private zone:NgZone) {
      this.removeList = [];
      
    }

    // bindingMethod
    public selectOrgCatalog(orgCatalogId:string){
      
      this.selectedOrgCatalog = orgCatalogId;
  
      if(this.selectedOrgCatalog){
  
        this.ccContext.OrganizationRepository.GetOrgAspectByCatalogId(this.selectedOrgCatalog)
            .subscribe(
              (aspect:OrgAspect[]) => {
  
                this.orgAspectList = aspect;
  
                if(this.orgAspectList.length > 0){
                  
                  this.selectedOrgAspect = this.orgAspectList[0].id;

                  if(this.nowPage == 'userAdd'){
                    this.ccContext.OrganizationRepository.GetAllOrgByOrgAspectId(this.selectedOrgAspect)
                        .subscribe(
                          (org:OrgInfo[]) => {

                            this.orgTreeData = this.transfer.TransferOrgWithOutAspect(org);

                            this.zone.runOutsideAngular(
                              () => {
                                this.userInOrgList.forEach(
                                  (org) => {
                                    this.setOrgTreeEleChecked(org.orgUri, true);
                                  }
                                );
                                
                                this.removeList.forEach(
                                  (org) => {
                                    this.setOrgTreeEleChecked(org.orgUri, false);
                                  }
                                )
                              }
                            );
                          }
                        );
                  }

                  if(this.nowPage == 'userEdit'){
                    this.ccContext.OrganizationRepository.GetOrgSourceTree(this.selectedOrgCatalog, this.selectedOrgAspect, this.userId)
                        .subscribe(
                          (result) => {

                            this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);

                            this.zone.runOutsideAngular(
                              () => {
                                this.userInOrgList.forEach(
                                  (org) => {
                                    this.setOrgTreeEleChecked(org.orgUri, true);
                                  }
                                );
                                
                                this.removeList.forEach(
                                  (org) => {
                                    this.setOrgTreeEleChecked(org.orgUri, false);
                                  }
                                )
                              }
                            );
                          }
                        );
                  }
  
                }
              }
            );
      }
  
        
    };

    public selectOrgAspect(orgAspectId:string){

      this.selectedOrgAspect = orgAspectId;

      if(this.nowPage == 'userAdd'){
        this.ccContext.OrganizationRepository.GetAllOrgByOrgAspectId(this.selectedOrgAspect)
            .subscribe(
              (org:OrgInfo[]) => {

                this.orgTreeData = this.transfer.TransferOrgWithOutAspect(org);

                this.zone.runOutsideAngular(
                  () => {
                    this.userInOrgList.forEach(
                      (org) => {
                        this.setOrgTreeEleChecked(org.orgUri, true);
                      }
                    );
          
                    this.removeList.forEach(
                      (org) => {
                        this.setOrgTreeEleChecked(org.orgUri, false);
                      }
                    )
                  }
                );

              }
            );
      }

      if(this.nowPage == 'userEdit'){
        this.ccContext.OrganizationRepository.GetOrgSourceTree(this.selectedOrgCatalog, this.selectedOrgAspect, this.userId)
            .subscribe(
              (result) => {

                this.orgTreeData = this.transfer.TransferOrgWithOutAspect(result);

                this.zone.runOutsideAngular(
                  () => {
                    this.userInOrgList.forEach(
                      (org) => {
                        this.setOrgTreeEleChecked(org.orgUri, true);
                      }
                    );
                    
                    this.removeList.forEach(
                      (org) => {
                        this.setOrgTreeEleChecked(org.orgUri, false);
                      }
                    )
                  }
                );
              }
            );
      }
    };

    public removeUserInOrgData(item:UserInOrgList) {

      this.removeList.push(item);
      
      this.sourceUserInOrgList.splice(this.sourceUserInOrgList.indexOf(item), 1);
      this.sourceUserInOrgList.forEach(
        (userInOrg, index) => {

          this.sourceUserInOrgList[index].priority = index;
        }
      );

      this.userInOrgList = JSON.parse(JSON.stringify(this.sourceUserInOrgList));
      
      this.sourceUserInOrgListChange.emit(this.sourceUserInOrgList);
    };

    public priorityOnChange(direction:string, userInOrg:UserInOrgList){

      if(direction == 'up'){ 
        let index = this.sourceUserInOrgList.indexOf(userInOrg);
        userInOrg.priority--;
        this.sourceUserInOrgList[index-1].priority++;

        this.sourceUserInOrgList[index] = this.sourceUserInOrgList[index-1];
        this.sourceUserInOrgList[index-1] = userInOrg;
      }
      else if(direction == 'down'){ 
        let index = this.sourceUserInOrgList.indexOf(userInOrg);
        userInOrg.priority++;
        this.sourceUserInOrgList[index+1].priority--;

        this.sourceUserInOrgList[index] = this.sourceUserInOrgList[index+1];
        this.sourceUserInOrgList[index+1] = userInOrg;
      };

      this.userInOrgList = JSON.parse(JSON.stringify(this.sourceUserInOrgList));
      this.sourceUserInOrgListChange.emit(this.sourceUserInOrgList);
    };

    public updateToSource(){
      
      this.removeList = [];
      this.sourceUserInOrgList = JSON.parse(JSON.stringify(this.userInOrgList));
      this.sourceUserInOrgListChange.emit(this.sourceUserInOrgList);
      this.contentTopService.EditProcessing(false);
      this.editStatus = !this.editStatus;
    };

    public checkedDefaultType(target:UserInOrgList){

      if (!target.isDefault){
        
        target.isDefault = true;
      }
      else{

        target.isDefault = false;
      };

      this.sourceUserInOrgList.forEach(
        (item) => {

         if(item.orgTypeUri == target.orgTypeUri){

          if(target != item){

            item.isDefault = false;
          }
         }
        }
      );

      this.sourceUserInOrgListChange.emit(this.sourceUserInOrgList);
    };

    public editUserInOrgList(){

      this.editStatus = !this.editStatus;
      this.userInOrgList = JSON.parse(JSON.stringify(this.sourceUserInOrgList));

      this.zone.runOutsideAngular(
        () => {
          this.userInOrgList.forEach(
            (org) => {
              this.setOrgTreeEleChecked(org.orgUri, true);
            }
          );

          this.removeList.forEach(
            (org) => {
              this.setOrgTreeEleChecked(org.orgUri, false);
            }
          )
        }
      );
    }


    // ModalMethod
    public previewModalOpen(){
      
      this.modalRef = this.modalService.open(this.PreviewModal);
    };

    
    // TreeEvent
    private getCheckedItem(treeData:TreeData[]): TreeData[] {
      return this.treeEvent.getCheckedItem(treeData, 'multiple');
    };


    // orgTreeRelate
    private orgTreeGetNotify(event: any) {
      if (event == "getResult") {
        let checkedOrg = this.getCheckedItem(this.orgTreeData);
  
        checkedOrg.forEach(
          (checkedOrg, index) => {
  
            let isInList: boolean = false;
            this.userInOrgList.forEach(
              (item) => {
                
                if(item.orgId == checkedOrg.id){
                  isInList = true;
                }
              }
            );
  
            if(!isInList){
              let target = new UserInOrgList(checkedOrg.id, "[empty]", "[empty]", this.userInOrgList.length, checkedOrg.hash)
              target.orgType = checkedOrg.orgTypeName;
              target.orgTypeUri = checkedOrg.orgTypeUri;
              target.orgUrn = checkedOrg.orgUrn;
              target.orgUri = checkedOrg.orgUri;
              target.name = checkedOrg.name;
              target.orgLabel = checkedOrg.label;
  
              this.userInOrgList.push(target);    
            };
          }
        );
      };
  
      if (event.eventName == "remove"){
        
        this.userInOrgList.forEach(
          (item, index) => {
            
            if(item.orgId == event.target.id){
  
              this.userInOrgList.splice(index, 1);
              this.userInOrgList.forEach(
                (item, index) =>{
  
                  item.priority = index;
                }
              );
            }
          }
        );  
      };
    };

    private setOrgTreeEleChecked(orgUri:string, targetValue:boolean){
      
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
    };

    private orgTreeLoop(target:TreeData[], orgUri:string, targetValue:boolean){
      
      this.zone.runOutsideAngular(
        () => {
          target.forEach(
            (org) => {

              if(org.orgUri == orgUri){
               
                org.checked = targetValue;
              }
      
              if(org.child.length>0){
      
                this.orgTreeLoop(org.child, orgUri, targetValue);
              }
            }
          );
        }
      )
    };
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