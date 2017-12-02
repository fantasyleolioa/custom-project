import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { RoleInfo } from "../../../../../../../../domain/RoleInfo";
import { DataPolicyRoleList } from "../../../../../../../../domain/DataPolicy";

import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';



@Component({
  selector: 'RoleDatapolicy',
  styleUrls: [('./roleDatapolicy.scss')],
  templateUrl: './roleDatapolicy.html'
})
export class RoleDatapolicy{

    @Input() ViewButtonList:AuthDataButton[];
    @Input() roleDatapolicyList: DataPolicyRoleList[] = [];

    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'roleView';

    public searchTarget: string = '';

    public backupPolicyList: DataPolicyRoleList[] = [];


    constructor(private contentTopService: ContentTopService, 
                private router: Router, 
                private ccContext:CCContext) {


    };


    // Enviroment 
    private EnvironmentStart() {
        this.contentTopService.subscribe("button.trigger", (eventName) => {
        
        });
    };


    // Binding Method
    public filterList(target){

        this.searchTarget = target;
        
        if(this.backupPolicyList.length == 0){
            this.backupPolicyList = JSON.parse(JSON.stringify(this.roleDatapolicyList));
        }

        this.roleDatapolicyList = 
            this.backupPolicyList.filter(
                (item) => {

                    if (target == "") {
                        return true;
                    };

                    return item.name.indexOf(target) >= 0 
                        || item.catalogName.indexOf(target) >= 0 
                }
            );        
    }

    public roleDataPolicyEdit(target:DataPolicyRoleList){
        
        console.log(target);

        let role: RoleInfo = new RoleInfo(target.id, target.name, '', 0, target.catalogId, '');

        window.sessionStorage.setItem('EdittedRole', JSON.stringify(role));
        window.sessionStorage.setItem('authTabStatus', 'dataPolicy');
        this.router.navigate(['/pages/permissionsManagement/roleAuthEdit']);
    }


    // private
    private viewButtonSelect(targetId:string){

        this.ViewButtonList.forEach(
            (viewButton) => {

                if(viewButton.id == targetId){
                    viewButton.isActive = true;
                }else{
                    viewButton.isActive = false;
                }
            }
        );

        this.ViewButtonListChange.emit(this.ViewButtonList);
    }
}