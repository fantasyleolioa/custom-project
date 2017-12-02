export class UserMetadata{
  public name:string;
  public value:any;
  public type:string;
  public typeParameter:Array<string>;
  public hash:string;
  public provider:Array<string>;
  public readOnly:boolean;
  public key:string;
  public catalogId:string;

  public providerText?:string;

  constructor(_name:string, _value:any, _type:string, _typeParameter:Array<string>, _hash:string, _provider:Array<string>, _readOnly:boolean){

    this.name = _name;
    this.value = _value;
    this.type = _type;
    this.typeParameter = _typeParameter;
    this.hash = _hash;
    this.provider = _provider;
    this.readOnly = _readOnly;
  }
}

export class UserMetadataColum{

  public metadataColumn:Array<UserMetadata>;
  public catalogId:string;

  constructor(_userMetaData:Array<UserMetadata>, _catalogId:string){

    this.metadataColumn = _userMetaData;
    this.catalogId = _catalogId;
  }
}
