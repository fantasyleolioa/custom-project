import {Component, ViewEncapsulation, Input} from '@angular/core';
import { Http } from "@angular/http";

import { TreeData } from "../../../../../../domain/treeData";

import { TreeDataTransferService } from "../../../../../../service/treeService/TreeDataTransfer.service";

@Component({
  selector: 'NormalDemo',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./normalDemo.scss'],
  templateUrl: './normalDemo.html'
})
export class NormalDemoComponent {

  // Property
  public treeData: TreeData[] = [];
  public treeStatus: string = 'view';

  // Constructor
  constructor(private http:Http, 
              private treeService:TreeDataTransferService) 
  {  
    this.http.get("./assets/orgTree.json")
        .map(res => res.json())
        .subscribe(
          (result) => {
            this.treeData = this.treeService.TransferOrgWithOutAspect(result);
          }
        )
  }


  // Method
  public changeStatus(status:string){

    this.treeStatus = status;

    this.treeData.forEach(
      (item) => {

        this.resetAll(item);
      }
    )
  }

  public resetAll(target:TreeData){

    target.checked = false;

    if(target.child.length > 0)[
      target.child.forEach(
        (item) => {

          this.resetAll(item);
        }
      )
    ]
  }

  public getNotify(){
    
  }
}
