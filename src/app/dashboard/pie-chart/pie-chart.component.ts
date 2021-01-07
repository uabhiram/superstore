import { Component, Input, OnInit } from '@angular/core';
import { AppState } from '../../shared/reducers';
import { Store, select } from '@ngrx/store';
import {
  selectGetCategories,
  selectYearCategory,
  selectGetSubCategories,
} from '../dashboard.selectors';
import { Observable, Subscription } from 'rxjs';
import { ChartOptions, ChartType } from 'chart.js';
import {
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  SingleDataSet,
} from 'ng2-charts';
import { PieChart } from '../model/piechart';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  pieChartsubCategoriesData: PieChart;
  loadCategories$: Observable<any>;
  categorySelected = 'Furniture';
  year = '2017';
  flag= false;
  subCategories: any;
  private eventsSubscription: Subscription;
  @Input() events: Observable<any>;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        '#003f5c',
        '#7a5195',
        '#ef5675',
        '#ffa600',
        '#58508d',
        '#955196',
        '#374c80',
        '#2f4b7c',
        'grey',
      ],
    },
  ];
  constructor(public store: Store<AppState>) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.loadCategories$ = this.store.pipe(select(selectGetCategories));
    this.getSubCategories();

    this.eventsSubscription = this.events.subscribe((res) => {
      this.flag = true;
      this.year = res.data;
      this.getPieChartData();
    });
  }

  getSubCategories(): void {
    this.store
      .pipe(select(selectGetSubCategories, { category: this.categorySelected }))
      .subscribe((response) => {
        this.pieChartLabels = response;
        this.subCategories = response;
        this.getPieChartData();
      });
  }
  getSelectedValue(): void {
    this.getSubCategories();
    this.getPieChartData();
  }
  getPieChartData(): void {
    this.pieChartData = [];
    this.pieChartLabels = this.subCategories;
    this.store
      .pipe(
        select(selectYearCategory, {
          year: this.year,
          category: this.categorySelected,
        })
      )
      .subscribe((response) => {
          this.subCategories.forEach((subcategory: string, index: number) => {
            const salesSum = response
              .filter(
                (order: { subcategory: string }) =>
                  order.subcategory === subcategory
              )
              .map((furniture: { sales: number }) => furniture.sales)
              .reduce((prev: number, curr: number) => prev + curr, 0);
            this.pieChartData[index] = Math.floor(salesSum);
          });
          console.log('piechrtdata', this.pieChartData);
      });
  }
}
