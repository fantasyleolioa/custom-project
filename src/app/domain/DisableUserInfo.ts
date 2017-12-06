export class DisableUserInfo {
    public id: string;
    public hash: string;
    public cause: string;

    constructor(_id: string, _hash: string, _cause: string) {
        this.id = _id;
        this.hash = _hash;
        this.cause = _cause;
    }
}