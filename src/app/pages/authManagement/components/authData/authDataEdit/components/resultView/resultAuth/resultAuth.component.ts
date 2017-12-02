import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Tab } from "../../../../../../../../domain/Tab";
import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../../../../../domain/BasicMetadata';
import { ConditionInfo } from "../../../../../../../authTree/domain/conditoinInfo";
import { ActionInfo } from "../../../../../../../authTree/domain/actionInfo";
import { AuthSource } from "../../../../../../../authTree/domain/authSource";
import { AuthTree } from "../../../../../../../authTree/domain/authTree";


@Component({
  selector: 'ResultAuth',
  styleUrls: [('./resultAuth.scss')],
  templateUrl: './resultAuth.html'
})
export class ResultAuth{

    @Input() tabInfo: Tab;
    @Input() ViewButtonList:AuthDataButton[];
    @Input() allowList: ActionInfo[] = [];
    @Input() denyList: ActionInfo[] = [];

    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'resultView';

    public selectedAction: ActionInfo = new ActionInfo();
    public conditionList: Array<Array<ConditionInfo>>= [];

    public isStateView: boolean = false;

    public searchTarget: string = '';

    public backupAllowList: ActionInfo[] = [];
    public backupDenyList: ActionInfo[] = []


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
    public selectState(target:ActionInfo){

        this.selectedAction = JSON.parse(JSON.stringify(target));
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

        this.isStateView = !this.isStateView;
    }

    public filterList(target){

        this.searchTarget = target;
        
        if(this.backupAllowList.length == 0 && this.backupDenyList.length == 0){
            this.backupAllowList = JSON.parse(JSON.stringify(this.allowList));
            this.backupDenyList = JSON.parse(JSON.stringify(this.denyList));
        }

        this.allowList = 
            this.backupAllowList.filter(
                (item) => {

                    if (target == "") {
                        return true;
                    };

                    return item.id.indexOf(target) >= 0 
                        || item.urn.indexOf(target) >= 0 
                        || item.name.indexOf(target) >= 0;
                }
            );
        
        this.denyList = 
            this.backupDenyList.filter(
                (item) => {

                    if (target == "") {
                        return true;
                    };

                    return item.id.indexOf(target) >= 0 
                        || item.urn.indexOf(target) >= 0 
                        || item.name.indexOf(target) >= 0;
                }
            );
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