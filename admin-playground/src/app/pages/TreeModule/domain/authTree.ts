import { ConditionInfo } from './conditoinInfo';

export class AuthTree{

    id:string;
    moduleId:string;
    parentId?:string;
    name:string;
    subCollapsed?:boolean;
    allow:boolean = false;
    deny:boolean = false;
    isInherit:boolean;
    condition?:ConditionInfo[];
    child:AuthTree[];

    constructor( _name:string, _id:string){

        this.name = _name;
        this.id = _id;
        this.child = [];
    }

    public SetSubCollapsed(target:boolean){
        this.subCollapsed = target;
    }
}