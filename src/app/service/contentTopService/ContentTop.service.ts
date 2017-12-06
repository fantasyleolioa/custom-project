import { Injectable } from '@angular/core';
import { Router, Routes, NavigationEnd } from '@angular/router';
import { Subject }    from 'rxjs/Subject';

import { ButtonSetting } from '../../domain/ButtonSetting';
import { GlobalState } from '../../global.state';

@Injectable()
export class ContentTopService {

    private _data = new Subject<Object>();
    private _dataStream$ = this._data.asObservable();
  
    private _subscriptions: Map<string, Function[]> = new Map<string, Function[]>();

    constructor(private state: GlobalState, private router: Router) {
        this._dataStream$.subscribe((data) => this._onEvent(data));
    }


    // ButtonRelate
    public AddButton(button: ButtonSetting) {

        this.notifyDataChanged('contentTop.add', button);
    }

    public DeleteButton(buttonId: string) {

        this.notifyDataChanged('contentTop.delete', buttonId);
    }

    public DisabledButton(buttonId: string) {

        this.notifyDataChanged('contentTop.disabled', buttonId);
    }

    public UnDisabledButton(buttonId: string) {

        this.notifyDataChanged('contentTop.unDisabled', buttonId);
    }

    public SetBackLastPage(status:boolean, directPage?:string){

        if(directPage){

            let target = { 'status':status, 'directPage':directPage };
            this.notifyDataChanged('contentTop.lastPageActive', target);
        }
        else{

            this.notifyDataChanged('contentTop.lastPageActive', status);
        }
    }

    public SetBackLastCustom(status:boolean){

        this.notifyDataChanged('contentTop.LastPageCustomActive', status);
    }


    // Status Relate
    public ChangeStatus(status: string) {

        if(status == 'normal'){
            this.SetBackLastPage(false)
        }

        this.notifyDataChanged('status.change', status);
    }

    public EditProcessing(status: boolean) {

        this.notifyDataChanged('contentTop.processing', status);
    }


    // Environment Relate
    public EnvironmentSetting(setting: ButtonSetting[]) {

        this.notifyDataChanged('environment.setting', setting);
    }

    public TitleSetting(title: string) {
        const result = { 'title': title };

        this.notifyDataChanged('menu.activeLink', result);
    }

    // Save & Cancel EventName Setting
    public SaveEventNameSetting(eventName: string) {

        this.notifyDataChanged('eventSetting.saveButton', eventName);
    }

    public CancelEventNameSetting(eventName: string) {

        this.notifyDataChanged('eventSetting.cancelButton', eventName);
    }


    // Own Subscription
    public notifyDataChanged(event, value) {
        
        const current = this._data[event];
        if (current !== value) {
            this._data[event] = value;
        }
        this._data.next({
            event: event,
            data: this._data[event],
        });
    }

    public subscribe(event: string, callback: Function) {
        const subscribers = this._subscriptions.get(event) || [];
        subscribers.push(callback);

        this._subscriptions.set(event, subscribers);
    }

    private _onEvent(data: any) {
        const subscribers = this._subscriptions.get(data['event']) || [];
        
        subscribers.forEach((callback) => {
            callback.call(null, data['data']);
        });
    }

    public clearSubscribe(event:string) {
        
        this._subscriptions.set(event, []);
    }
}
