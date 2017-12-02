import { ConditionInfo } from './conditoinInfo';


export class ActionInfo{
    public moduleId:string;
    public parentId:string;
    public id:string;
    public name:string;
    public hash:string;
    public uri:string;
    public urn:string;
    public effect:string;
    public condition:ConditionInfo[]; 
}