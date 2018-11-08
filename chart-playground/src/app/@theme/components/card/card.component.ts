import { Component, Input } from '@angular/core';

@Component({
    selector: 'ngx-card',
    templateUrl: './card.html',
    styleUrls: ['./card.scss'],
})
export class BasicCardComponent {
    // property
    @Input() withoutTitle: boolean = false;
}
