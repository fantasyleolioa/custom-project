import {Component, ViewEncapsulation} from '@angular/core';

import { ContentTopService } from '../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'Console',
  styleUrls: ['./console.scss'],
  templateUrl: './console.html'
})
export class ConsoleComponent {

  treeData:any[] = [];
  tabList:tab[] = [];

  constructor(private contenTopService:ContentTopService) {

    this.contenTopService.EnvironmentSetting([]);
    this.contenTopService.ChangeStatus("normal");
    this.contenTopService.TitleSetting("主控台");

    this.tabList.push(new tab(true, "Test1111"));
    this.tabList.push(new tab(false, "Test1111"));
  }

  public tabButtonClick(target: tab){
    
    this.tabList.forEach(
      (ele: tab) => {

        if(ele == target){
          ele.isFocus = true
        }
        else{
          ele.isFocus = false;
        };
      }

    );
    
  }
}

class tab{
  public isFocus: boolean = false;
  public name: string = '';

  constructor(_isFocus:boolean, _name: string) { 
    this.isFocus = _isFocus;
    this.name = _name;
  }
}
