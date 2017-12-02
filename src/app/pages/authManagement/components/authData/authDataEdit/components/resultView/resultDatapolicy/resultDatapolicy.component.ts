import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { DataPolicyResultList } from "../../../../../../../../domain/DataPolicy";

import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';



@Component({
  selector: 'ResultDatapolicy',
  styleUrls: [('./resultDatapolicy.scss')],
  templateUrl: './resultDatapolicy.html'
})
export class ResultDatapolicy{

    @Input() ViewButtonList:AuthDataButton[];
    @Input() resultDatapolicyList: DataPolicyResultList[] = [];


    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'resultView';

    public searchTarget: string = '';

    public backupPolicyList: DataPolicyResultList[] = [];


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
            this.backupPolicyList = JSON.parse(JSON.stringify(this.resultDatapolicyList));
        }

        this.resultDatapolicyList = 
            this.backupPolicyList.filter(
                (item) => {

                    if (target == "") {
                        return true;
                    };

                    return item.name.indexOf(target) >= 0 
                        || item.urn.indexOf(target) >= 0 
                        || item.orgTypeName.indexOf(target) >= 0
                        || item.effectName.indexOf(target) >= 0;
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