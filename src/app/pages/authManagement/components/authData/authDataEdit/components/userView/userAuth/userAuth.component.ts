import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Tab } from "../../../../../../../../domain/Tab";
import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';
import { BasicMetadata } from '../../../../../../../../domain/BasicMetadata';
import { ConditionInfo } from "../../../../../../../authTree/domain/conditoinInfo";
import { AuthTree } from "../../../../../../../authTree/domain/authTree";


@Component({
  selector: 'UserAuth',
  styleUrls: [('./userAuth.scss')],
  templateUrl: './userAuth.html'
})
export class UserAuth{

    @Input() tabInfo: Tab;
    @Input() ViewButtonList:AuthDataButton[];
    @Input() authTreeData: AuthTree[] = [];
    @Input() selectedAppId: string;

    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'userView';

    public selectedAction: AuthTree = new AuthTree("", "");
    public conditionList: Array<Array<ConditionInfo>>= [];

    public isStateView: boolean = false;


    constructor(private contentTopService: ContentTopService, 
                private router: Router, 
                private ccContext:CCContext) {


    };


    // Binding Method
    public userAuthEdit(){
        
        window.sessionStorage.setItem('authTabStatus', 'auth');
        window.sessionStorage.setItem('selectedApp', this.selectedAppId);
        this.router.navigate(['/pages/permissionsManagement/userAuthEdit']);
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