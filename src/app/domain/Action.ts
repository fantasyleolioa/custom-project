import { ActionCondition } from './ActionCondition';

export class Action{
    public moduleId:string;
    public parentId:string;
    public id:string;
    public name:string;
    public hash:string;
    public condition:ActionCondition[]; 
    public inheritCondition:InheritConditionInfo;
}


export class InheritConditionInfo{

    public id: string;
    public name: string;
    public condition:InheritConditionDetail[];
    public subCollapsed: boolean = true;

    constructor(){
        this.id = "";
        this.name = "";
        this.condition = [];
        this.subCollapsed = true;
    }
}

export class InheritConditionDetail{
    public key: string;
    public name: string;
    public type: string;
    public defaultValue: string;
    public actionId: string;
    public actionName: string;
    public hash: string;
    public createBy: string;
    public isInherit: boolean;
}