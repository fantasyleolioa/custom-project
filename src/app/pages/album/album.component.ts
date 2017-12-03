import { Component, ViewEncapsulation } from '@angular/core';

import { ContentTopService } from '../../service/contentTopService/ContentTop.service';


@Component({
  selector: 'Album',
  styleUrls: ['./album.scss'],
  templateUrl: './album.html'
})
export class AlbumComponent {

    // Property
    public tabList:tab[] = [];

    
    // Constructor
    constructor(private contenTopService:ContentTopService) {

        this.contenTopService.TitleSetting("作品展示");

        this.tabList.push(new tab(true, "AppFoundry"));
        this.tabList.push(new tab(false, "CAC(出貨管理系統)"));
        this.tabList.push(new tab(false, "CC(後臺權限管理系統)"));
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
