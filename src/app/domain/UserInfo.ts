export class UserInfo {
    public id: string;
    public name: string;
    public hash: string;

    constructor(_id: string, _name: string, _hash: string) {
        this.id = _id;
        this.name = _name;
        this.hash = _hash;
    }
}