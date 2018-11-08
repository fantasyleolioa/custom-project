import { NgModule } from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { QuadrantChartComponent, QuadrantSeriesComponent, QuadrantXAxisComponent, QuadrantXTicksComponent, QuadrantYAxisComponent, QuadrantYTicksComponent } from "./";


@NgModule({
  imports: [
    NgxChartsModule
  ],
  declarations: [
    QuadrantChartComponent,
    QuadrantSeriesComponent,
    QuadrantXAxisComponent,
    QuadrantXTicksComponent,
    QuadrantYAxisComponent,
    QuadrantYTicksComponent
  ],
  exports: [
    QuadrantChartComponent,
    QuadrantSeriesComponent,
    QuadrantXAxisComponent,
    QuadrantXTicksComponent,
    QuadrantYAxisComponent,
    QuadrantYTicksComponent
  ]
})
export class QurdrantChartModule {}
