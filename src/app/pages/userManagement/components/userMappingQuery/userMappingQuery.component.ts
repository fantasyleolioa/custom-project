import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalState } from '../../../../global.state';
import { ButtonSetting } from '../../../../domain/ButtonSetting';
import { UserInfo } from '../../../../domain/UserInfo';
import { CCContext } from '../../../../domain/CCContext';
import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'UserMappingQuery',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./userMappingQuery.scss'],
  templateUrl: './userMappingQuery.html'
})
export class UserMappingQuery{

  // Properties
  public userId:string = "";
  public userName:string = "";
  public userOrg:string = "";
  public userList: Array<UserInfo> = [];
  public divideList: Array<UserInfo> = [];
  public resultShow: boolean = false;

  public nowPage:string = "1";
  public pageCount:number = 1;

  public pannelEnvironment: ButtonSetting[] = [];

  public searchButtonText:string = "开始查询";
  public searchButtonStatus:boolean = false;
  public isPageChanged:boolean = false;
  public lastPage:string = "1";

  // Constructor
  constructor(private ccContext: CCContext, 
              private contentTopService: ContentTopService, 
              private router: Router)
  {
    this.contentTopService.clearSubscribe("button.trigger");
    this.EnvironmentStart();
    this.EnvironmentSetting();
  }

  // Method
  public changePage(pageTarget:string, variable:number) {

    if ((Number(pageTarget) + variable) == 0){
      this.nowPage = "1";
    } else if((Number(pageTarget) + variable) > this.pageCount){
      this.nowPage = this.pageCount.toString();
    } else{
      this.nowPage = (Number(pageTarget) + variable).toString();
    };

    this.searchDataWithPage(Number(this.nowPage));
  };

  public addUser() {
    this.router.navigate(['/pages/userManagement/userAdd']);
  };

  public editUserMapping(user:UserInfo) {
    window.sessionStorage.setItem("EdittedUserMapping", JSON.stringify(user));
    this.router.navigate(['/pages/userManagement/userMappingEdit']);
  };

  public searchData() {

    this.searchButtonStatus = true;
    this.searchButtonText = "查询中";
    this.resultShow = true;
    this.userList = [];

    this.ccContext.UserRepository.QueryUser(1, this.userId, this.userName)
        .subscribe(
          (result) => {

            this.pageCount = Math.ceil(result.totalCount / 20);
            if(this.pageCount == 0){this.pageCount = 1};

            result.user.forEach(
              (item) => {

                if(item.id != 'superadmin'){

                  this.userList.push(item);
                }
              }
            );
            this.divideList = JSON.parse(JSON.stringify(this.userList));

            this.userList = this.divideList;


            this.searchButtonText = "开始查询";
            this.searchButtonStatus = false;

            this.nowPage = "1";
          }
        );  
  }

  public searchDataWithPage(pageNumber:number) {

    this.resultShow = true;
    this.userList = [];

    this.ccContext.UserRepository.QueryUser(pageNumber, this.userId, this.userName)
        .subscribe(
          (result) => {

            this.pageCount = Math.ceil(result.totalCount / 20);
            if(this.pageCount == 0){this.pageCount = 1};

            result.user.forEach(
              (item) => {

                if(item.id != 'superadmin'){

                  this.userList.push(item);
                }
              }
            );
            this.divideList = JSON.parse(JSON.stringify(this.userList));
          }
        );    
  }

  // State Trigger
  private EnvironmentSetting() {
    this.contentTopService.ChangeStatus('normal');

    this.contentTopService.EnvironmentSetting([]);
  };

  
  // Global Subscribe
  private EnvironmentStart() {
    this.contentTopService.subscribe("button.trigger", (eventName) => {
      
    });
  };

  // PageNumber Input
  private onKeyUp(event:KeyboardEvent){

    if (event.key == "Enter"){

      if(Number(this.nowPage) > this.pageCount){

        this.lastPage = this.pageCount.toString();
        this.nowPage = this.pageCount.toString();
      }
      else if(Number(this.nowPage) <= 0){

        this.lastPage = "1";
        this.nowPage = "1";
      }
      else{

        this.lastPage = Number(this.nowPage).toString();
      }


      this.searchDataWithPage(Number(this.lastPage));
    };
  };

  private onFocusOut(event:FocusEvent){

    if(Number(this.lastPage) != Number(this.nowPage)){

      if(Number(this.nowPage) > this.pageCount){

        this.lastPage = this.pageCount.toString();
        this.nowPage = this.pageCount.toString();
      }
      else if(Number(this.nowPage) <= 0){

        this.lastPage = "1";
        this.nowPage = "1";
      }
      else{

        this.lastPage = Number(this.nowPage).toString();
      };

      this.searchDataWithPage(Number(this.lastPage));
    };
  };
}
