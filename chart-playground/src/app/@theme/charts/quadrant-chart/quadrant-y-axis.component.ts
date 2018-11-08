import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    ViewChild,
    SimpleChanges,
    ChangeDetectionStrategy
} from '@angular/core';
import { QuadrantYTicksComponent } from './quadrant-y-ticks.component';

@Component({
    selector: 'g[ngx-quadrant-y-axis]',
    template: `
    <svg:g
        [attr.class]="yAxisClassName"
        [attr.transform]="transform">
        <svg:g ngx-quadrant-y-ticks
            *ngIf="yScale"
            [quadrantSwitch]="quadrantSwitch"
            [tickFormatting]="tickFormatting"
            [tickArguments]="tickArguments"
            [tickValues]="ticks"
            [tickStroke]="tickStroke"
            [scale]="yScale"
            [orient]="yOrient"
            [showGridLines]="showGridLines"
            [gridLineWidth]="dims.width"
            [height]="dims.height"
            (dimensionsChanged)="emitTicksWidth($event)"/>

        <svg:g ngx-charts-axis-label
            *ngIf="showLabel"
            [label]="labelText"
            [offset]="labelOffset"
            [orient]="yOrient"
            [height]="dims.height"
            [width]="dims.width">
        </svg:g>
    </svg:g>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuadrantYAxisComponent implements OnChanges {
    // property
    @Input() quadrantSwitch: boolean;
    @Input() yScale;
    @Input() dims;
    @Input() tickFormatting;
    @Input() ticks: any[];
    @Input() showGridLines = false;
    @Input() showLabel;
    @Input() labelText;
    @Input() yAxisTickInterval;
    @Input() yAxisTickCount: any;
    @Input() yOrient: string = 'left';
    @Input() referenceLines;
    @Input() showRefLines;
    @Input() showRefLabels;
    @Input() yAxisOffset: number = 0;
    @Output() dimensionsChanged = new EventEmitter();

    yAxisClassName: string = 'y axis';
    tickArguments: any;
    offset: any;
    transform: any;
    labelOffset: number = 15;
    fill: string = 'none';
    stroke: string = '#CCC';
    tickStroke: string = '#CCC';
    strokeWidth: number = 1;
    padding: number = 5;

    @ViewChild(QuadrantYTicksComponent) ticksComponent: QuadrantYTicksComponent;


    // implements
    ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }


    // method
    update(): void {
        this.offset = -(this.yAxisOffset + this.padding);
        if (this.yOrient === 'right') {
            this.labelOffset = 65;
            this.transform = `translate(${this.offset + this.dims.width} , 0)`;
        } else {
            this.offset = this.offset;
            this.transform = `translate(${this.offset } , 0)`;
        }

        if (this.yAxisTickCount !== undefined) {
            this.tickArguments = [this.yAxisTickCount];
        }
    }

    emitTicksWidth({ width }): void {
        if (width !== this.labelOffset && this.yOrient === 'right') {
            this.labelOffset = width + this.labelOffset;
            setTimeout(() => {
            this.dimensionsChanged.emit({width});
            }, 0);
        } else if (width !== this.labelOffset) {
            this.labelOffset = width;
            setTimeout(() => {
            this.dimensionsChanged.emit({width});
            }, 0);
        }
    }

}
