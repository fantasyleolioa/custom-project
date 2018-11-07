export class AppInfo{

    public id:string;
    public name:string;
    public effect?:string;

    constructor(_id:string, _name:string, _effect?:string){

        this.id = _id;
        this.name = _name;
        this.effect = _effect;
    }
}