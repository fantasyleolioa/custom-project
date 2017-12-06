import { Component, ViewEncapsulation } from '@angular/core';

import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'Tree',
  styleUrls: ['./treeComponent.scss'],
  templateUrl: './treeComponent.html'
})
export class TreeComponent {
    
    // Property
    public tabList:tab[] = [];

    
    // Constructor
    constructor(private contentTopService:ContentTopService) {

        this.contentTopService.TitleSetting("樹狀資料展示");

        this.tabList.push(new tab(true, "權限樹"));
        this.tabList.push(new tab(false, "一般樹"));
    }

    
    // Method
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
