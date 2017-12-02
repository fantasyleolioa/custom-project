import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthDataButton } from "../../../../../../../../domain/ButtonSetting";
import { DataPolicyResultList } from "../../../../../../../../domain/DataPolicy";

import { CCContext } from '../../../../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../../../../service/contentTopService/ContentTop.service';



@Component({
  selector: 'UserDatapolicy',
  styleUrls: [('./userDatapolicy.scss')],
  templateUrl: './userDatapolicy.html'
})
export class UserDatapolicy{

    @Input() ViewButtonList:AuthDataButton[];
    @Input() userDatapolicyList: DataPolicyResultList[] = [];

    @Output() ViewButtonListChange:EventEmitter<any> = new EventEmitter<any>();

    public selectedViewButton: string = 'userView';

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
    public userDataPolicyEdit(){
        
        window.sessionStorage.setItem('authTabStatus', 'dataPolicy');
        this.router.navigate(['/pages/permissionsManagement/userAuthEdit']);
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