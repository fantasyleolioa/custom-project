import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { ChartPlaygroundContext } from "../../domain/ChartPlaygroundContext";

import { ContactInfo } from "../../domain/User";
import { ToasterService, ToasterConfig, Toast, BodyOutputType, OnActionCallback } from 'angular2-toaster';
import { SpinnerService } from "../../@theme/services/spinner.service";
import 'style-loader!angular2-toaster/toaster.css';

import { single, test2, barChart, lineChartSeries, gaugeData, bubbleData, logined } from "../DashboardData";


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
	yAxisLabel = 'Impression';
	xAxisLabel = 'Click';
	showXAxis = true;
	showYAxis = true;
	animations = true;
	gradient = false;
	showLegend = false;
	tooltipDisabled = false;
	colorScheme = {
		domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
	};

	// combo
	comboBarScheme = {
		name: 'singleLightBlue',
		selectable: true,
		group: 'Ordinal',
		domain: ['#82bfbf']
	};
	lineChartScheme = {
		name: 'coolthree',
		selectable: true,
		group: 'Ordinal',
		// domain: ['#01579b', '#01579b', '#01579b', '#82bfbf']
		domain: ['#82bfbf', '#01579b', '#01579b', '#01579b']
		};
	barChart: any[];
	lineChartSeries: any[];

	// gauge
	gaugeData: any[];
	gaugeShowAxis: boolean = true;
	gaugeMin: number = 0;
  	gaugeMax: number = 10;
	gaugeLargeSegments: number = 5;
	gaugeSmallSegments: number = 2;
	gaugeUnits: string = 'impression';
	gaugeAngleSpan: number = 180;
	gaugeStartAngle: number = -90;

	// spreadsChart & quadrant
	spreadData: any[];
	roundDomains = true;
	autoScale = true;
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

		this.spreadData = [...bubbleData];

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

	}

	selectChart(chartSelector) {
		this.chartType = chartSelector;

		console.log(this.chartType);
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
		target = this.results[0].value
	}else {
		target = value
	}

	return target + '分';
}