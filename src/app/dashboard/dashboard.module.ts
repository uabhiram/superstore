import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CardComponent } from './card/card.component';
import { DashboardHttpService } from './dashboard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './dashboard.effects';
import { StoreModule } from '@ngrx/store';
import { DashboardReducer } from './reducers/dashboard.reducers';
import { DashboardResolver } from './dashboard.resolver';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { MiniCardComponent } from './mini-card/mini-card.component';
export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
    resolve: {
      courses: DashboardResolver,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ChartsModule,
    NgxChartsModule,
    RouterModule.forChild(dashboardRoutes),
    EffectsModule.forFeature([DashboardEffects]),
    StoreModule.forFeature('orders', DashboardReducer),
  ],
  declarations: [
    DashboardHomeComponent,
    CardComponent,
    OrdersTableComponent,
    BarChartComponent,
    PieChartComponent,
    MiniCardComponent,
  ],
  exports: [DashboardHomeComponent],
  entryComponents: [],
  providers: [DashboardHttpService, DashboardResolver],
})
export class DashboardModule {
  constructor() {}
}
