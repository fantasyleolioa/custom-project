import { Component, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as Rx from 'rxjs';

import { ContentTopService } from '../../../../service/contentTopService/ContentTop.service';

@Component({
  selector: 'DragArea',
  styleUrls: ['./dragArea.scss'],
  templateUrl: './dragArea.html'
})
export class DragAreaComponent {

    // Porperty
    @ViewChild('drag') drag:ElementRef;

    ngAfterViewInit(){
        this.dragActoin();
    }


    // Constructor
    constructor(private contentTopService:ContentTopService, private zone:NgZone) {

        this.contentTopService.TitleSetting("拖拉區塊實作");
    }


    // Method
    public dragActoin(){

        this.zone.runOutsideAngular(
            () => {
                
                const mouseDown = Rx.Observable.fromEvent( this.drag.nativeElement, 'mousedown');
                const mouseMove = Rx.Observable.fromEvent( this.drag.nativeElement, 'mousemove');
                const mouseUp = Rx.Observable.fromEvent( this.drag.nativeElement, 'mouseup');
                const mouseOut = Rx.Observable.fromEvent( this.drag.nativeElement, 'mouseut');

        
                const validValue = (value, max, min) => {
                    return Math.min(Math.max(value, min), max)
                }
        
                mouseDown
                    .map(e => mouseMove.takeUntil(mouseUp))
                    .concatAll()
                    .withLatestFrom(mouseDown, (move:MouseEvent, down:MouseEvent) => {
                        return {
                            x: validValue(move.clientX - down.offsetX, window.innerWidth - 320, 0),
                            y: validValue(move.clientY - down.offsetY, window.innerHeight - 180, 0)
                        }
                    })
                    .subscribe(pos => {
                        this.drag.nativeElement.style.top = pos.y + 'px';
                        this.drag.nativeElement.style.left = pos.x + 'px';
                    });
                

            }
        )
    }
}