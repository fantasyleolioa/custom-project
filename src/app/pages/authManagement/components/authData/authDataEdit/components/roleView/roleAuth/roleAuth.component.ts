import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Tab } from "../../../../../../../../domain/Tab";
import { RoleInfo } from "../../../../../../../../domain/RoleInfo";
import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../../../../../domain/BasicMetadata';
import { ConditionInfo } from "../../../../../../../authTree/domain/conditoinInfo";
import { AuthSource } from "../../../../../../../authTree/domain/authSource";
import { AuthTree } from "../../../../../../../authTree/domain/authTree";
import { RolePermission } from "../../../../../../../authTree/domain/rolePermission";

import { BaThemeSpinner } from "../../../../../../../../theme/services";


@Component({
  selector: 'RoleAuth',
  styleUrls: [('./roleAuth.scss')],
  templateUrl: './roleAuth.html'
})
export class RoleAuth{

    @Input() tabInfo: Tab;
    @Input() ViewButtonList:AuthDataButton[];
    @Input() rolePermissionList: RolePermission[] = [];
    @Input() selectedAppId: string;

    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'roleView';

    public selectedAction: AuthTree = new AuthTree("", "");
    public conditionList: Array<Array<ConditionInfo>>= [];

    public isStateView: boolean = false;

    public searchTarget: string = '';

    public backupRoleList: RolePermission[] = []


    constructor(private contentTopService: ContentTopService, 
                private router: Router,
                private preloader: BaThemeSpinner, 
                private ccContext:CCContext) {


    };


    // Binding Method
    public filterList(target){

        this.searchTarget = target;
        
        if(this.backupRoleList.length == 0){
            this.backupRoleList = JSON.parse(JSON.stringify(this.rolePermissionList));
        }

        this.rolePermissionList = 
            this.backupRoleList.filter(
                (item) => {

                    if (target == "") {
                        return true;
                    };

                    return item.id.indexOf(target) >= 0 
                        || item.catalogName.indexOf(target) >= 0 
                        || item.name.indexOf(target) >= 0;
                }
            );
    }

    public roleAuthEdit(target:RolePermission){
        
        console.log(target);

        let role: RoleInfo = new RoleInfo(target.id, target.name, '', 0, target.catalogId, '');

        window.sessionStorage.setItem('EdittedRole', JSON.stringify(role));
        window.sessionStorage.setItem('authTabStatus', 'auth');
        window.sessionStorage.setItem('selectedApp', this.selectedAppId);
        this.router.navigate(['/pages/permissionsManagement/roleAuthEdit']);
    }


    // Enviroment 
    private EnvironmentStart() {
        this.contentTopService.subscribe("button.trigger", (eventName) => {
        
        });
    };


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


    // Tree Event Emitter
    private getNotify(event: any) {

        if (event.name == 'settingButton.click'){
        
            this.selectedAction = JSON.parse(JSON.stringify(event.target));
            this.conditionList = [];
            this.selectedAction.condition.forEach(
                (item) => {

                    if(item.type == 'time'){
                        let date:string = item.value.split(" ")[0];
                        let divide = item.value.split(" ")[1];
                        item.clock = divide.split(":")[0];
                        item.minute = divide.split(":")[1];
                        item.second = divide.split(":")[2];

                        item.date = date;
                    };
                }
            );

            for(let i=1; i<=Math.ceil( this.selectedAction.condition.length/3); i++){

                this.conditionList.push([]);
                for(let j=i*3-2; j<=i*3; j++){

                    if( this.selectedAction.condition[j-1]) this.conditionList[i-1].push( this.selectedAction.condition[j-1]);
                };
            };

            this.isStateView = true;
            console.log(this.selectedAction);
        };
    };
}