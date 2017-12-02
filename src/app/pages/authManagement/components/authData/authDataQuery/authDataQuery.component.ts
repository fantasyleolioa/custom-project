import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { CCContext } from '../../../../../domain/CCContext';
import { ContentTopService } from '../../../../../service/contentTopService/ContentTop.service';
import { UserInfo } from '../../../../../domain/UserInfo';


@Component({
  selector: 'AuthDataQuery',
  styleUrls: [('./authDataQuery.scss')],
  templateUrl: './authDataQuery.html'
})
export class AuthDataQuery {

  public userId:string = "";
  public userName:string = "";
  public userOrg:string = "";
  public nowPage:string = "1";
  public pageCount:number = 1;
  public userList:Array<UserInfo> = [];
  public divideList: UserInfo[] = [];
  public resultShow: boolean = false;
  
  public searchButtonText:string = "查询";
  public searchButtonStatus:boolean = false;
  public isPageChanged:boolean = false;
  public lastPage:string = "1";


  constructor(private contentTopService: ContentTopService, 
              private router: Router, 
              private ccContext:CCContext) {

    this.contentTopService.clearSubscribe("button.trigger");
    this.contentTopService.TitleSetting('权限总览');
    this.contentTopService.ChangeStatus('normal');
    this.contentTopService.EnvironmentSetting([]);
  }


  // Method
  public searchData() {

    this.searchButtonStatus = true;
    this.searchButtonText = "查询中";
    this.userList = [];
    this.resultShow = true;

    this.ccContext.UserRepository.QueryUser(1, this.userId, this.userName)
        .subscribe(
          (result) => {

            this.pageCount = Math.ceil(result.totalCount / 10);
            if(this.pageCount == 0){this.pageCount = 1};

            this.userList = result.user;

            this.searchButtonText = "查询";
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

            this.pageCount = Math.ceil(result.totalCount / 10);
            if(this.pageCount == 0){this.pageCount = 1};

            this.userList = result.user;
          }
        );       
  }
  
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

  public editUserAuth(user:UserInfo){

    window.sessionStorage.setItem("EdittedUser", JSON.stringify(user));

    this.router.navigate(["/pages/permissionsManagement/authDataEdit"]);
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
