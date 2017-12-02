import {Component, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Tab } from '../../../../domain/Tab';
import { BasicMetadata } from "../../../../domain/BasicMetadata";
import { OrgInfo, OrgAspect, OrgInOrgTag, OrgTag, OrgTagTreeData } from "../../../../domain/OrgInfo";
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { CCContext } from "../../../../domain/CCContext";
import { JsonpModule } from '@angular/http/src/http_module';


@Component({
  selector: 'UserInOrgTag',
  styleUrls: ['./userInOrgTag.scss'],
  templateUrl: './userInOrgTag.html'
})
export class UserInOrgTagComponent {

    @Input() tabInfo:Tab;
    @Input() sourceUserInOrgTagList:OrgTagTreeData[];
    @Input() userInOrgTagList: OrgTagTreeData[] = [];
    @Input() orgInTagTreeData:OrgTagTreeData[];

    @Input() nowPage: string = '';

    public editStatus: boolean = false;
    public modalRef:NgbModalRef;    

    @ViewChild('PreviewModal') public PreviewModal;        
    
    @Output() sourceUserInOrgTagListChange:EventEmitter<any> = new EventEmitter<any>();
    
    ngAfterViewInit() {
      // this.userInOrgTagList = JSON.parse(JSON.stringify(this.sourceUserInOrgTagList));
    };

    constructor(private treeEvent: TreeEventService, 
                private transfer: TreeDataTransferService,
                private ccContext: CCContext,
                private modalService: NgbModal,
                private contentTopService: ContentTopService) { 
                
      this.editStatus = false;
    }

    // BindingMethod
    public updateToSource(){
                  
      this.sourceUserInOrgTagList = JSON.parse(JSON.stringify(this.userInOrgTagList));
      this.sourceUserInOrgTagListChange.emit(this.sourceUserInOrgTagList);
      this.contentTopService.EditProcessing(false);
      this.editStatus = !this.editStatus;
    };

    public removeOrgInTag(item:OrgTagTreeData) {
      
      this.sourceUserInOrgTagList.splice(this.sourceUserInOrgTagList.indexOf(item), 1);

      this.userInOrgTagList = JSON.parse(JSON.stringify(this.sourceUserInOrgTagList))

      this.sourceUserInOrgTagListChange.emit(this.sourceUserInOrgTagList);

      this.setOrgTreeEleChecked(item.id, false);
    };


    // ModalMethod
    public previewModalOpen(){
      
      this.modalRef = this.modalService.open(this.PreviewModal);
    };


    // TreeEvent
    private getCheckedItem(treeData:OrgTagTreeData[]): OrgTagTreeData[] {
      return this.treeEvent.getCheckedOrgInTag(treeData, 'multiple');
    };


    // orgTreeRelate
    private orgTreeGetNotify(event: any) {
      if (event == "getResult") {
        let checkedOrg = JSON.parse(JSON.stringify(this.getCheckedItem(this.orgInTagTreeData)));
  
        checkedOrg.forEach(
          (checkedOrg, index) => {
  
            let isInList: boolean = false;
            this.userInOrgTagList.forEach(
              (item) => {
  
                if(item.id == checkedOrg.id){
                  isInList = true;
                }
              }
            );
  
            if(!isInList){
  
              this.userInOrgTagList.push(checkedOrg);    
            };
          }
        );
      };
  
      if (event.eventName == "remove"){
  
        this.userInOrgTagList.forEach(
          (item, index) => {
  
            if(item.id == event.target.id){
  
              this.userInOrgTagList.splice(index, 1);
            }
          }
        );  
      };

      if (event.eventName == 'userInOrgTag.remove'){

        this.removeOrgInTag(event.target);
      }
    };

    private setOrgTreeEleChecked(orgIntagId:string, targetValue:boolean){
      
      this.orgInTagTreeData.forEach(
        (orgIntag) => {
  
          if(orgIntag.id == orgIntagId){
            orgIntag.checked = targetValue;
          }
        }
      )
    };
}