export class BehaviorState{

  public key:string;
  public name:string;
  public appId:string;
  public moduleId:string;
  public actionId:string;
  public type:string;
  public defaultValue:string;
  public typeParameterString: string;
  public Checked?:boolean = false;
  public hash:string;


  constructor(_key:string, 
              _name:string,
              _appId:string, 
              _moduleId:string,
              _actionId:string,
              _dataType:string, 
              _default:string,
              _typeParameterString:string, 
              _hash:string){

    this.key = _key;
    this.name = _name;
    this.appId = _appId;
    this.moduleId = _moduleId;
    this.actionId = _actionId;
    this.type = _dataType;
    this.defaultValue = _default;
    this.typeParameterString = _typeParameterString;
    this.hash = _hash;
  }
}