import { Injectable } from '@angular/core';
import { UserInfo } from '../domain/UserInfo';
@Injectable()
export class SelectedUsersService {
    private users: UserInfo[] = [];
    constructor() {
    }
    public initUsers() {
        this.users = [];
    }
    public getUsers() {
        return this.users;
    }
    public setUsers(users: UserInfo[]) {
        this.users = users;
    }

}