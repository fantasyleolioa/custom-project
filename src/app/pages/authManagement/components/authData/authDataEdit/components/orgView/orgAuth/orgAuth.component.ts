import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Tab } from "../../../../../../../../domain/Tab";
import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../../../../../domain/BasicMetadata';
import { ConditionInfo } from "../../../../../../../authTree/domain/conditoinInfo";
import { OrgPermission } from "../../../../../../../authTree/domain/orgPermission";
import { AuthTree } from "../../../../../../../authTree/domain/authTree";


@Component({
  selector: 'OrgAuth',
  styleUrls: [('./orgAuth.scss')],
  templateUrl: './orgAuth.html'
})
export class OrgAuth{

    @Input() tabInfo: Tab;
    @Input() ViewButtonList:AuthDataButton[];
    @Input() orgPermissionList: OrgPermission[] = [];
    @Input() selectedAppId: string;

    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'orgView';

    public selectedAction: AuthTree = new AuthTree("", "");
    public conditionList: Array<Array<ConditionInfo>>= [];

    public isStateView: boolean = false;

    public searchTarget: string = '';

    public backupOrgList: OrgPermission[] = [];
    

    constructor(private contentTopService: ContentTopService, 
                private router: Router, 
                private ccContext:CCContext) {


    };


    // Binding Method
    public filterList(target){

        this.searchTarget = target;
        
        if(this.backupOrgList.length == 0){
            this.backupOrgList = JSON.parse(JSON.stringify(this.orgPermissionList));
        }

        this.orgPermissionList = 
            this.backupOrgList.filter(
                (item) => {

                    if (target == "") {
                        return true;
                    };

                    return item.orgName.indexOf(target) >= 0 
                        || item.label.indexOf(target) >= 0 
                        || item.orgUrn.indexOf(target) >= 0;
                }
            );
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