import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { ChartPlaygroundContext } from "../../domain/ChartPlaygroundContext";

import { MultiData, QuadrantData, SingleData } from "../../domain/Charts";
import { ToasterService, ToasterConfig, Toast, BodyOutputType, OnActionCallback } from 'angular2-toaster';
import { SpinnerService } from "../../@theme/services/spinner.service";
import 'style-loader!angular2-toaster/toaster.css';

import { barChart, lineChartSeries, gaugeData, bubbleData } from "../DashboardData";


@Component({
	selector: 'ngx-charts',
	styleUrls: ['./charts.scss'],
	templateUrl: './charts.html',
})
export class ChartsComponent {
	// property
	chartType: string =  'combo';
	toasterconfig: ToasterConfig;

	// basic
	view: any[] = undefined;
	isFitContainer = true;
	fixedWidth = 0;
	fixedHeight = 0;
	showYLabel = true;
	showXLabel = true;
	showXAxis = true;
	showYAxis = true;
	animations = true;
	showGridlines = true;
	showLegend = false;

	roundDomains = true;
	autoScale = true;

	gradient = false;
	tooltipDisabled = false;
	colorScheme = {
		domain: ['#5AA454', '#A10A28', '#5036f3']
	};

	// combo
	comboBarScheme = {
		name: 'singleLightBlue',
		selectable: true,
		group: 'Ordinal',
		domain: ['#a3a375']
	};
	lineChartScheme = {
		name: 'coolthree',
		selectable: true,
		group: 'Ordinal',
		// domain: ['#01579b', '#01579b', '#01579b', '#82bfbf']
		domain: ['#a3a375', '#01579b', '#01579b', '#01579b']
		};
	barChart: SingleData[];
	lineChart: MultiData[];

	// gauge
	gaugeData: SingleData[];
	gaugeShowAxis: boolean = true;
	gaugeMin: number = 0;
  	gaugeMax: number = 10;
	gaugeLargeSegments: number = 5;
	gaugeSmallSegments: number = 2;
	gaugeUnits: string = 'impression';
	gaugeAngleSpan: number = 180;
	gaugeStartAngle: number = -90;

	// spreadsChart & quadrant
	spreadData: QuadrantData[];
	schemeType: string = 'ordinal';
	radius = 4;

	// constructor
	constructor(
		private toasterService: ToasterService,
		private router: Router,
		private modalService: NgbModal,
		private spinner: SpinnerService,
		private context: ChartPlaygroundContext,) 
	{
		this.spinner.preHide();

		Object.assign(this, { gaugeValueFormatting });
		this.spreadData = [...bubbleData];
		this.barChart = [...barChart];
		this.lineChart = [...lineChartSeries];
		this.gaugeData = [...gaugeData];

		this.toasterconfig = new ToasterConfig({
			positionClass: 'toast-top-center',
			timeout: 0,
			newestOnTop: true,
			tapToDismiss: true,
			preventDuplicates: false,
			animation: 'slideDown',
			limit: 1
		});
	}

	// method
	gaugeValueFormatting(){}

	shuffleData(){
		switch (this.chartType) {
			case 'combo':
				this.comboShuffle();
				break;
			case 'spread':
				this.spreadShuffle();
				break;
			case 'quadrant':
				this.spreadShuffle();
				break;
			case 'gauge':
				this.gaugeShuffle();
				break;
			default:
				break;
		}
	}

	spreadShuffle(){	
		let spread = this.spreadData;

		spread.forEach(
			(bubble) => {
				bubble.series.forEach(
					(position) => {
						position.x = this.getRandom(400, 1200);
						position.y = this.getRandom(60, 90);
					}
				)
			} 
		);

		this.spreadData = [...spread];
	}

	comboShuffle(){
		let line = this.lineChart;
		let bar = this.barChart;

		line.forEach(
			(line) => {
				line.series.forEach(
					(position) => {
						position.value = this.getRandom(5000, 60000);
					}
				)
			} 
		);

		bar.forEach(
			(bar) => {
				bar.value = this.getRandom(5000, 60000);
			} 
		);

		this.lineChart = [...line];
		this.barChart = [...bar];
	}

	quadrantShuffle(){

	}

	gaugeShuffle(){
		let gauge = this.gaugeData;

		gauge.forEach(
			(point) => {
				point.value = this.getRandom(1, 10);
			}
		);

		this.gaugeData = [...gauge];
	}

	getRandom(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	};

	selectChart(chartSelector) {
		this.chartType = chartSelector;
		this.isFitContainer = true;
		this.view = undefined;

		console.log(this.chartType);
	}

	changFitContainer(target){
		this.isFitContainer = target;

		if(this.isFitContainer){
			this.view = undefined;
		};
	}

	setView(){
		this.view = [this.fixedWidth, this.fixedHeight]
	}


	// toast
	showToast(type: string, body: string, hideCallback: OnActionCallback) {
		const toastDetail: Toast = {
			type: type,
			title: '',
			body: body,
			timeout: 0,
			showCloseButton: true,
			bodyOutputType: BodyOutputType.TrustedHtml,
			onHideCallback: hideCallback
		};

		this.toasterService.pop(toastDetail);
	}


	// combo
	yAxisScale(min, max) {
		return { min: `${min}`, max: `${max}` };
	}
	
	yTickFormat(data) {
		return `${data.toLocaleString()}`;
	}
}

export function gaugeValueFormatting(value){
	let target;

	if(this.results){
		target = this.results[0].value;
		return ;
	}else {
		target = value
	}

	return target;
}