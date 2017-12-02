import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';

import { Tab } from '../../../../domain/Tab';
import { TreeData } from '../../../../domain/TreeData';
import { TreeDataTransferService, TreeEventService } from '../../../../service/treeService';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { CCContext } from "../../../../domain/CCContext";


@Component({
  selector: 'UserInRole',
  styleUrls: ['./userInRole.scss'],
  templateUrl: './userInRole.html'
})
export class UserInRoleComponent {

    @Input() tabInfo:Tab;
    @Input() roleTreeData:TreeData[];
    @Input() sourceRoleIdList:string[];
    @Input() selectedRoleList: RoleTable[] = [];

    @Output() sourceRoleIdListChange:EventEmitter<any> = new EventEmitter<any>();

    ngAfterViewInit() {
    };

    constructor(private treeEvent: TreeEventService, 
                private transfer: TreeDataTransferService,
                private ccContext: CCContext,
                private contentTopService: ContentTopService) {

      
    }


    // TreeEvent
    private getCheckedItem(treeData:TreeData[]): TreeData[] {
      return this.treeEvent.getCheckedItem(treeData, 'multiple');
    };


    // TreeRelate
    private getNotify(event: any) {
      if (event == "getResult") {
  
        this.roleTreeData.forEach(
          (item) => {
            item.checked = false;
            item.singleChecked = false;
          }
        );
  
        let checkedRole = this.getCheckedItem(this.roleTreeData);
  
        this.selectedRoleList = [];
        this.sourceRoleIdList = [];
  
        checkedRole.forEach(
          (item) => {
  
            this.selectedRoleList.push(new RoleTable(item.catalogId, item.roleCatalogName, item.id, item.name));        
            this.sourceRoleIdList.push(item.id);
          }
        );

        this.sourceRoleIdListChange.emit(this.sourceRoleIdList);
      };
    };
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