import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({ selector: '[tableScroll]' })
export class TableScrollDirective implements OnInit {
    // property


    // oninit
    ngOnInit(){
        setTimeout(
            () => {
                this.onResize();
            },
            1000
        );    
    }


    // constructor
    constructor(private ele: ElementRef) {
    }


    // methods
    checkScrollBar(scrollHight: Number, clientHight: Number){
        if(scrollHight <= clientHight){
            this.ele.nativeElement.style.width = '100%';
        }else {
            this.ele.nativeElement.style.width = 'calc(100% + 5px)'
        }
    }

    // listener
    @HostListener('window:resize') 
    onResize(){
        this.checkScrollBar(this.ele.nativeElement.scrollHeight, this.ele.nativeElement.clientHeight);
    }
}