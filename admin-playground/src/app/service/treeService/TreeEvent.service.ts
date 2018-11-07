import { Injectable } from '@angular/core';

import { TreeData } from '../../domain/TreeData';
import { OrgTagTreeData } from "../../domain/OrgInfo";


@Injectable()
export class TreeEventService {

    constructor() { }


    public getCheckedItem(treeData: TreeData[], editStatus: string) {

        const result: TreeData[] = [];

        if (editStatus == 'multiple') {

            this.getMultipleCheckedItem(treeData, result);
        }

        if (editStatus == 'single') {

            this.getSingleCheckedItem(treeData, result);
        }

        return result;
        
    }

    public IsRootChecked(treeData: TreeData[], editStatus: string) {

        let result: boolean = false;


        if (editStatus == 'multiiple') {

            treeData.forEach(
                (item) => {

                    if (item.checked) {

                        result = true;
                    }
                },
            );
        }

        if (editStatus == 'single') {

            treeData.forEach(
                (item) => {

                    if (item.singleChecked) {

                        result = true;
                    }
                },
            );
        }

        return result;
    }

    public getCheckedOrgInTag(treeData: OrgTagTreeData[], editStatus: string) {

        const result: OrgTagTreeData[] = [];

        if (editStatus == 'multiple') {

            this.getMultipleOrgInTag(treeData, result);
        }
        
        return result;
        
    }


    // GetCheckedItem
    private getMultipleCheckedItem(treeData: TreeData[], result: TreeData[]) {

        treeData.forEach(
            (item) => {
                if (item.checked) {

                    result.push(item);
                }


                if (item.child.length > 0) {

                    this.getMultipleCheckedItem(item.child, result);
                }
            },
        );
    }

    private getSingleCheckedItem(treeData: TreeData[], result: TreeData[]) {

        treeData.forEach(
            (item) => {

                if (item.singleChecked) {

                    result.push(item);
                }


                if (item.child.length > 0) {

                    this.getSingleCheckedItem(item.child, result);
                }
            },
        );
    }

    private getMultipleOrgInTag(treeData: OrgTagTreeData[], result: OrgTagTreeData[]) {

        treeData.forEach(
            (item) => {
                if (item.checked) {

                    result.push(item);
                }


                if (item.child.length > 0) {

                    this.getMultipleOrgInTag(item.child, result);
                }
            },
        );
    }
}
