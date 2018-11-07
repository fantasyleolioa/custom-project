import { Component, ViewEncapsulation } from '@angular/core';

import { ButtonSetting } from "../../../../domain/ButtonSetting";

import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'StateDemo',
  styleUrls: ['./stateDemo.scss'],
  templateUrl: './stateDemo.html'
})
export class StateDemoComponent {


    // Constructor
    constructor(private contentTopService:ContentTopService) {

        this.contentTopService.TitleSetting("狀態Service實作");
        this.EnviromentStart();
    }


    // Method
    public addButton(){

        this.contentTopService.AddButton(new ButtonSetting('test', 'I am New', 'btn-primary-normal', 'newButtonClick', false));
    }

    public deleteButton(){

        this.contentTopService.DeleteButton('test');
    }

    public disableButton(){

        this.contentTopService.DisabledButton('test');
    }

    public UndisableButton(){

        this.contentTopService.UnDisabledButton('test');
    }

    public changeTitle(){

        this.contentTopService.TitleSetting("Hey I am Chang~~~ YOOOOO")
    }


    // Enviroment
    public EnviromentStart(){
        this.contentTopService.subscribe("button.trigger", (eventName) => {

            if(eventName == 'newButtonClick'){

                window.alert("U Click Me !!!");
            }
        });
    }
}