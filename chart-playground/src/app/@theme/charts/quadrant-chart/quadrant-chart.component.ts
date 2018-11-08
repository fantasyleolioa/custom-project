import {
    Component,
    Input,
    Output,
    EventEmitter,
    HostListener,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ContentChild,
    TemplateRef
} from '@angular/core';
import {
    trigger,
    style,
    animate,
    transition
} from '@angular/animations';
import { BaseChartComponent, calculateViewDimensions, ViewDimensions, ColorHelper } from '@swimlane/ngx-charts';

import { scaleLinear } from 'd3-scale';
import { getScaleType, getDomain, getScale } from './quadrant.util';
import { id } from './id';


@Component({
    selector: 'ngx-charts-quadrant-chart',
    templateUrl: './quadrant.html',
    styleUrls: ['./quadrant-chart.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('animationState', [
            transition(':leave', [
                style({
                    opacity: 1,
                }),
                    animate(500, style({
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class QuadrantChartComponent extends BaseChartComponent {
    // property
    @Input() quadrantSwitch: boolean = false;;
    @Input() showGridLines: boolean = true;
    @Input() legend = false;
    @Input() legendTitle: string = 'Legend';
    @Input() xAxis: boolean = true;
    @Input() yAxis: boolean = true;
    @Input() showXAxisLabel: boolean;
    @Input() showYAxisLabel: boolean;
    @Input() xAxisLabel: string;
    @Input() yAxisLabel: string;
    @Input() xAxisTickFormatting: any;
    @Input() yAxisTickFormatting: any;
    @Input() xAxisTicks: any[];
    @Input() yAxisTicks: any[];
    @Input() roundDomains: boolean = false;
    @Input() maxRadius = 10;
    @Input() minRadius = 3;
    @Input() autoScale: boolean;
    @Input() schemeType = 'ordinal';
    @Input() legendPosition: string = 'right';
    @Input() tooltipDisabled: boolean = false;
    @Input() xScaleMin: any;
    @Input() xScaleMax: any;
    @Input() yScaleMin: any;
    @Input() yScaleMax: any;

    @Output() activate: EventEmitter<any> = new EventEmitter();
    @Output() deactivate: EventEmitter<any> = new EventEmitter();

    @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

    dims: ViewDimensions;
    colors: ColorHelper;
    scaleType = 'linear';
    margin = [10, 20, 10, 20];
    bubblePadding = [0, 0, 0, 0];
    data: any;

    legendOptions: any;
    transform: string;

    clipPath: string;
    clipPathId: string;

    seriesDomain: any[];
    xDomain: any[];
    yDomain: any[];

    xScaleType: string;
    yScaleType: string;

    yScale: any;
    xScale: any;
    rScale: any;

    xAxisHeight: number = 0;
    yAxisWidth: number = 0;

    activeEntries: any[] = [];


    // method
    update(): void {
        super.update();

        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showXAxis: this.xAxis,
            showYAxis: this.yAxis,
            xAxisHeight: this.xAxisHeight,
            yAxisWidth: this.yAxisWidth,
            showXLabel: this.showXAxisLabel,
            showYLabel: this.showYAxisLabel,
            showLegend: this.legend,
            legendType: this.schemeType
        });

        this.seriesDomain = this.results.map(d => d.name);
        this.xDomain = this.getXDomain();
        this.yDomain = this.getYDomain();

        this.transform = `translate(${ this.dims.xOffset },${ this.margin[0] })`;

        const colorDomain = this.seriesDomain;
        this.colors = new ColorHelper(this.scheme, this.schemeType, colorDomain, this.customColors);

        this.data = this.results;

        this.minRadius = Math.max(this.minRadius, 1);
        this.maxRadius = Math.max(this.maxRadius, 1);

        this.rScale = this.getRScale([1, 1], [this.minRadius, this.maxRadius]);

        this.bubblePadding = [0, 0, 0, 0];
        this.setScales();

        this.bubblePadding = this.getBubblePadding();
        this.setScales();

        this.legendOptions = this.getLegendOptions();

        this.clipPathId = 'clip' + id().toString();
        this.clipPath = `url(#${this.clipPathId})`;
    }

    onClick(data, series?): void {
        if (series) {
            data.series = series.name;
        }

        this.select.emit(data);
    }

    getBubblePadding() {
        let yMin = 0;
        let xMin = 0;
        let yMax = this.dims.height;
        let xMax = this.dims.width;

        for (const s of this.data) {
            for (const d of s.series) {
                const r = this.rScale(1);
                const cx = (this.xScaleType === 'linear') ? this.xScale(Number(d.x)) : this.xScale(d.x);
                const cy = (this.yScaleType === 'linear') ? this.yScale(Number(d.y)) : this.yScale(d.y);
                xMin = Math.max(r - cx, xMin);
                yMin = Math.max(r - cy, yMin);
                yMax = Math.max(cy + r, yMax);
                xMax = Math.max(cx + r, xMax);
            }
        }

        xMax = Math.max(xMax - this.dims.width, 0);
        yMax = Math.max(yMax - this.dims.height, 0);

        return [yMin, xMax, yMax, xMin];
    }

    getYScale(domain, height): any {
        return getScale(domain, [height, 0], this.yScaleType, this.roundDomains);
    }

    getXScale(domain, width): any {
        return getScale(domain, [0, width], this.xScaleType, this.roundDomains);
    }


    getRScale(domain, range): any {
        const scale = scaleLinear()
            .range(range)
            .domain(domain);

        return this.roundDomains ? scale.nice() : scale;
    }

    setScales() {
        let width = this.dims.width;
        if (this.xScaleMin === undefined && this.xScaleMax === undefined) {
            width = width - this.bubblePadding[1];
        }
        let height = this.dims.height;
        if (this.yScaleMin === undefined && this.yScaleMax === undefined) {
            height = height - this.bubblePadding[2];
        }
        this.xScale = this.getXScale(this.xDomain, width);
        this.yScale = this.getYScale(this.yDomain, height);
    }

    getLegendOptions(): any {
        const opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            position: this.legendPosition,
            title: undefined
        };

        
        opts.domain = this.seriesDomain;
        opts.colors = this.colors;
        opts.title = this.legendTitle;
        

        return opts;
    }

    getXDomain(): any[] {
        const values = [];

        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.x)) {
                    values.push(d.x);
                }
            }
        }

        this.xScaleType = getScaleType(values);
        return getDomain(values, this.xScaleType, this.autoScale, this.xScaleMin, this.xScaleMax);
    }

    getYDomain(): any[] {
        const values = [];

        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.y)) {
                    values.push(d.y);
                }
            }
        }

        this.yScaleType = getScaleType(values);
        return getDomain(values, this.yScaleType, this.autoScale, this.yScaleMin, this.yScaleMax);
    }

    updateYAxisWidth({ width }): void {
        this.yAxisWidth = width;
        this.update();
    }

    updateXAxisHeight({ height }): void {
        this.xAxisHeight = height;
        this.update();
    }

    onActivate(item): void {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name;
        });
        if (idx > -1) {
            return;
    }

        this.activeEntries = [ item, ...this.activeEntries ];
        this.activate.emit({ value: item, entries: this.activeEntries });
    }

    onDeactivate(item): void {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name;
        });

        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];

        this.deactivate.emit({ value: item, entries: this.activeEntries });
    }

    deactivateAll() {
        this.activeEntries = [...this.activeEntries];
        for (const entry of this.activeEntries) {
            this.deactivate.emit({ value: entry, entries: [] });
        }
        this.activeEntries = [];
    }

    trackBy(index, item): string {
        return item.name;
    }

    baseXline(): string{
        if(this.quadrantSwitch){
            return 'translate(0,' + (this.dims.height/2) +  ')';
        }else {
            return 'translate(0,' + this.dims.height +  ')';
        }        
    }

    baseYline(): string{
        if(this.quadrantSwitch){
            return 'translate(' + (this.dims.width/2) + ',0)';
        }else {
            return '';
        }
    }


    // hostlistener
    @HostListener('mouseleave')
        hideCircles(): void {
        this.deactivateAll();
    }
}
  