import {Component, ViewEncapsulation} from '@angular/core';

import { GlobalState } from '../../../../global.state';
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';
import { CCContext } from '../../../../domain/CCContext';
import { BaThemeSpinner } from "../../../../theme/services/baThemeSpinner";


@Component({
  selector: 'StageSetting',
  styleUrls: [('./stageSetting.scss')],
  templateUrl: './stageSetting.html'
})
export class StageSetting {

  public stage:Stage = new Stage();

  public updateStageEvent:string = "";

  public pannelEnvironment: ButtonSetting[] = [];

 
  constructor(private contentTopService: ContentTopService, 
              private ccContext:CCContext,
              private preLoader:BaThemeSpinner) 
  {
    this.contentTopService.clearSubscribe("button.trigger");

    this.preLoader.preloaderShow();

    this.ccContext.IdentityRepository.getStage()
        .subscribe(
          (result) => {
            
            this.stage = result;

            if(this.stage.isPublishing){

              this.stage.lastUpdateTime = "正在更新中，请稍后";
              this.stage.nextUpdateTime = "正在更新中，请稍后";

              this.contentTopService.DisabledButton("updateStage");
            }
            else{
              this.stage.lastUpdateTime = new Date(this.stage.lastUpdateTime).toLocaleString();
              this.stage.nextUpdateTime = new Date(this.stage.nextUpdateTime).toLocaleString();
            }

            this.preLoader.preloaderHide();
          },
          (error) =>{
            if(error._body != ""){
              window.alert(JSON.parse(error._body).message);
            }
            else{
              window.alert(error.statusText);
            }

            this.preLoader.preloaderHide();
          }
        );

    this.contentTopService.ChangeStatus('normal');
    this.EnvironmentSetting();
    this.EnvironmentStart();
  }


  // Method
  public updateStage(){

    this.preLoader.preloaderShow();

    this.ccContext.IdentityRepository.updateStage()
        .subscribe(
          (result) => {

            this.resetEnv();
          },
          (error) => {

            if(error._body != ""){
              window.alert(JSON.parse(error._body).message);
            }
            else{
              window.alert(error.statusText);
            }

          }
        )
  }

  // State Trigger
  private EnvironmentSetting() {

    this.updateStageEvent = "updateStageEvent";

    this.contentTopService.ChangeStatus('normal');
    this.pannelEnvironment = []
    this.pannelEnvironment.push(new ButtonSetting('updateStage', '立即更新', 'btn-primary-normal', this.updateStageEvent, false));
    this.contentTopService.EnvironmentSetting(this.pannelEnvironment);
  };

  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
        switch (eventName) {
            case this.updateStageEvent:
            this.updateStage();
            break;
        }
    });
  };


  // functonal method
  private resetEnv(){
    this.ccContext.IdentityRepository.getStage()
        .subscribe(
          (result) => {
            console.log(result);

            this.stage = result;

            if(this.stage.isPublishing){

              this.stage.lastUpdateTime = "正在更新中，请稍后";
              this.stage.nextUpdateTime = "正在更新中，请稍后";

              this.contentTopService.DisabledButton("updateStage");
            }
            else{
              this.stage.lastUpdateTime = new Date(this.stage.lastUpdateTime).toLocaleString();
              this.stage.nextUpdateTime = new Date(this.stage.nextUpdateTime).toLocaleString();
            }

            this.preLoader.preloaderHide();
          },
          (error) =>{
            if(error._body != ""){
              window.alert(JSON.parse(error._body).message);
            }
            else{
              window.alert(error.statusText);
            }

            this.preLoader.preloaderHide();
          }
        )

    this.EnvironmentSetting();
  };
  
}

class Stage{

  public updateInterval:string;
  public lastUpdateTime:string;
  public nextUpdateTime:string;
  public isPublishing:boolean;

  constructor(){}
}
