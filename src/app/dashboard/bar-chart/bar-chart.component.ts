import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BarChart } from '../model/barchart';
import { selectGetCategories, selectYear } from '../dashboard.selectors';
import { AppState } from '../../shared/reducers';
import { Store, select } from '@ngrx/store';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Observable, Subscription, zip } from 'rxjs';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  stackedBarChartData: BarChart[];
  flag = false;
  categories: any;
  year ='2017';
  public barChartOptions: ChartOptions = {};
  public barChartLabels: Label[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartColors = ['#003f5c', '#bc5090', '#ffa600'];
  public barChartData: ChartDataSets[] = [];
  constructor(
    public store: Store<AppState>
  ) {}
  private eventsSubscription: Subscription;

  @Input() events: Observable<any>;

  ngOnInit(): void {
    this.stackedBarChartData = [];
    this.store.pipe(select(selectGetCategories)).subscribe((categories) => {
      this.categories = categories;
      this.getBarChartData();
    });
    this.eventsSubscription = this.events.subscribe((res) => {
      this.flag = true;
      this.year = res.data;
      this.getBarChartData();
    });
  }

  getBarChartData(): void {
    this.barChartData =[];
    this.store
      .pipe(select(selectYear, { year: this.year }))
      .subscribe((res) => {
        this.categories.forEach((category: string, index: number) => {
          const categoryFilter = res.filter(
            (order: { category: string }) => order.category === category
          );
          const stackedBarChartData = new BarChart();
          this.stackedBarChartData[index] = stackedBarChartData;
          this.stackedBarChartData[index].backgroundColor = this.barChartColors[
            index
          ];
          this.stackedBarChartData[index].label = category;
          for (let i = 0; i < 12; i++) {
            const salesSum = categoryFilter
              .filter(
                (order: { orderDate: string }) =>
                  order.orderDate.split('/')[0] === (i + 1).toString()
              )
              .map((furniture: { sales: number }) => furniture.sales)
              .reduce((prev: number, curr: number) => prev + curr, 0);
            this.stackedBarChartData[index].data[i] = Math.floor(salesSum);
          }
        });
        this.barChartData = this.stackedBarChartData;
        console.log('barchrtdata', this.barChartData);
      });
  }
}
