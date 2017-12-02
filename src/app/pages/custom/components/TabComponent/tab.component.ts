import { Component, ViewEncapsulation } from '@angular/core';

import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'Tab',
  styleUrls: ['./tab.scss'],
  templateUrl: './tab.html'
})
export class TabComponent {

  public treeData:any[] = [];
  public tabList:tab[] = [];

  constructor(private contenTopService:ContentTopService) {

    this.contenTopService.TitleSetting("Tab樣式展示");

    this.tabList.push(new tab(true, "Content1"));
    this.tabList.push(new tab(false, "Content2"));
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
