import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { CCContext } from "../../../../domain/CCContext";
import { BasicMetadata } from "../../../../domain/BasicMetadata";
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { UserMetadata } from '../../../../domain/UserMetadata';
import { Tab } from "../../../../domain/Tab";


import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";


@Component({
  selector: 'ResumeDeactivatesEdit',
  styleUrls: ['./resumeDeactivatesEdit.scss'],
  templateUrl: './resumeDeactivatesEdit.html'
})
export class ResumeDeactivatesEdit {

  // Properties
  public reasonDeactivation: string = "";
  public prohibitedDate: string = "";
  public resumeCause:string = "";

  public userData: BasicMetadata = new BasicMetadata()
  public userMetadataInfo: UserMetaDataColumInfo[] = [];

  public pannelEnvironment: ButtonSetting[] = [];
  public promptText: string = "";

	public saveEvent:string = "";
	
	public tabList:Tab[] = [];


  // Constructor
	constructor(private ccContext: CCContext, 
							private contentTopService: ContentTopService, 
							private router: Router,
							private preloader:BaThemeSpinner) {


		this.preloader.preloaderShow();
		this.contentTopService.clearSubscribe("button.trigger");

		this.tabList.push(new Tab(true, '用户资讯', 'userInfo'));

		this.userData = JSON.parse(window.sessionStorage.getItem("ResumeUser"));

    if(!this.userData.id){

      window.sessionStorage.clear();
      window.sessionStorage.setItem("redirectPage", '/pages/userManagement/resumeDeactivatesQuery');
      window.alert("需要重新登入，将导向回登入页入页");
      this.router.navigate(["/login"]);
		}
		
		this.ccContext.UserRepository.QueryDisabledUserMetaData(this.userData.id)
				.map(
					(result) => {
						let metadataInfo:UserMetaDataColumInfo[] = [];

						result.metadata.forEach(
							(item) => {
								let userMetadata:Array<Array<UserMetadata>> = [];

								for(let i=1; i<=Math.ceil(item.metadataColumn.length/3); i++){
									
									userMetadata.push([]);

									for(let j=i*3-2; j<=i*3; j++){
										
										if(j <= item.metadataColumn.length){

											item.metadataColumn[j-1].readOnly = this.checkedReadOnly(item.metadataColumn[j-1]);
											item.metadataColumn[j-1].providerText = this.setProviderText(item.metadataColumn[j-1]);

											if(item.metadataColumn[j-1].type == "single" || item.metadataColumn[j-1].type == "boolean"){
												item.metadataColumn[j-1].value = item.metadataColumn[j-1].typeParameter[0]
											}
											
											userMetadata[i-1].push(item.metadataColumn[j-1]);
										};
									};
								};

								metadataInfo.push(new UserMetaDataColumInfo(item.catalogId, userMetadata));
							}
						);

						return metadataInfo;
					}
				)
				.subscribe(
					(metadataInfo:UserMetaDataColumInfo[]) => {
						
						this.userMetadataInfo = metadataInfo;
						this.preloader.preloaderHide();
					},
					(error) => {
						if(error._body != ""){
							this.promptText = JSON.parse(error._body).message;
						}
						else{
							this.promptText = error.statusText;
						}
						
						this.preloader.preloaderHide();
						this.contentTopService.ChangeStatus("edit");
					}
				);
			
		this.EnvironmentSetting();      
		this.EnvironmentStart();
  };

  // Method
  public saveButtonAction() {

		this.ccContext.UserRepository.EnableUser(this.userData.id, this.resumeCause)
				.subscribe(
					(result) => {

						this.router.navigate(['/pages/userManagement/userQuery']);
					},
					(error) => {
						if(error._body != ""){
							this.promptText = JSON.parse(error._body).message;
						}
						else{
							this.promptText = error.statusText;
						}
						
						this.contentTopService.ChangeStatus("edit");
					}
				);
	};
	
	public resumeCauseTypeIn(content){
		this.resumeCause = content;

		if(this.resumeCause){
			this.contentTopService.UnDisabledButton('enableUser');
		}
		else{
			this.contentTopService.DisabledButton('enableUser');
		}
	};

  // State Trigger
  private EnvironmentSetting() {

		let title = this.userData.name + '(' + this.userData.id + ')';
		this.contentTopService.TitleSetting(title);


    this.saveEvent = "enableUserSave";
		
		this.pannelEnvironment.push(new ButtonSetting('enableUser', '恢复', 'btn-primary-normal', this.saveEvent, true));    		

		this.contentTopService.ChangeStatus('normal');
		this.contentTopService.SetBackLastPage(true);		
    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };

  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      if (eventName == this.saveEvent) {
        this.saveButtonAction();
      }
    });
  };

  // Private
  private checkedReadOnly(target:UserMetadata){

    let result:boolean = true;

    if(target.readOnly){

      target.provider.forEach(
        (item) => {

          if (item == "cc"){
            result = false;
          }
        }
      );
    }
    else{
      return false;
    };

    return result;
  };

  private setProviderText(target:UserMetadata){

    let result:string = "";
    
    if(target.provider.length <= 0){

      return result;
    }
    else{

      result = result + "("

      target.provider.forEach(
        (provider:string, index:number) => {

          if(index == 0){
            result = result + provider;
          }
          else{
            result = result + "、" + provider;
          }
        }
      );

      result = result + ")";
    };

    return result;
  };
}


class UserMetaDataColumInfo{
	
		catalogId: string;
		metadataColumn: Array<Array<UserMetadata>>;
	
		constructor(_catalogId:string, _metadataColum:Array<Array<UserMetadata>>){
	
			this.catalogId = _catalogId;
			this.metadataColumn = _metadataColum;
		}
	}