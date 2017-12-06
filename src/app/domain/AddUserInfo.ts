export class AddUserInfo {
    public id: string;
    public name: string;
    public password: string;

    constructor(_id: string, _name: string, _password: string) {
        this.id = _id;
        this.name = _name;
        this.password = _password;
    }
}