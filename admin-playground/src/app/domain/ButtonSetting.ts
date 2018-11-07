export class ButtonSetting{

    public Id:string;
    public ButtonText:string;
    public ButtonClass:string;
    public EventName:string;
    public IsDisabled:boolean;

    constructor (_id:string, _buttonText:string, _buttonClass:string, _eventName:string, _isDisabled:boolean){
        this.Id = _id;
        this.ButtonText = _buttonText;
        this.ButtonClass = _buttonClass;
        this.EventName = _eventName;
        this.IsDisabled = _isDisabled;
    }
}

export class AuthDataButton{
    id: string
    isActive: boolean;

    constructor(_id:string, _isActive:boolean){
        this.id = _id;
        this.isActive = _isActive;
    }
}