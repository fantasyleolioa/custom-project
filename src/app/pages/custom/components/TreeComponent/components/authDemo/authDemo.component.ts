import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Http } from "@angular/http";

import { AuthTree } from "../../../../../TreeModule/domain/authTree";

import { AuthTreeService } from "../../../../../TreeModule/service/authTree.service";


@Component({
  selector: 'AuthDemo',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./authDemo.scss'],
  templateUrl: './authDemo.html'
})
export class AuthDemoComponent {

  // Property
  public treeData: AuthTree[] = [];
  public treeStatus: string = 'normal';


  // Constructor
  constructor(private http:Http, 
              private authTreeService:AuthTreeService) 
  {  
    this.http.get("./assets/authTree.json")
        .map(res => res.json())
        .subscribe(
          (result) => {
            this.treeData = this.authTreeService.TransferApplication(result);
          }
        )
  }


  // Method
  public getNotify(){
    
  }
}
