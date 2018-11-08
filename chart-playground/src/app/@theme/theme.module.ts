import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TableScrollDirective } from "./directives";
import { SpinnerService } from "./services/spinner.service";

import { ComboChartComponent, ComboSeriesVerticalComponent } from "./charts/combo-chart";
import { QurdrantChartModule } from "./charts/quadrant-chart/quadrant-chart.module";
import { BasicCardComponent } from "./components";;
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ToasterModule } from 'angular2-toaster';


const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, NgxChartsModule];

const NB_MODULES = [
	NgbModule,
	QurdrantChartModule
];

const COMPONENTS = [
	BasicCardComponent,
	ComboChartComponent,
	ComboSeriesVerticalComponent,
];

const DIRECTIVE = [
	TableScrollDirective
];

const PIPES = [
];

const NB_THEME_PROVIDERS = [
	SpinnerService
];

@NgModule({
	imports: [...BASE_MODULES, ...NB_MODULES, ToasterModule.forChild(),],
	exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES, ...DIRECTIVE],
	declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVE],
})
export class ThemeModule {
	static forRoot(): ModuleWithProviders {
		return <ModuleWithProviders>{
			ngModule: ThemeModule,
			providers: [...NB_THEME_PROVIDERS],
		};
	}
}
