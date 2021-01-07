import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../shared/reducers';
import { selectGetYears, selectYear } from '../dashboard.selectors';
import { OrderSummary } from '../model/order-summary';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  years: any;
  displayCharts: boolean;
  eventsSubject: Subject<any> = new Subject<any>();
  yearSelected: string;
  loadYears$: Observable<any>;
  loading$: Observable<any>;
  miniCardData: any[] = [];
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: { cols: 1, rows: 1 },
          chart: { cols: 1, rows: 2 },
          table: { cols: 1, rows: 6 },
        };
      }

      return {
        columns: 4,
        miniCard: { cols: 1, rows: 1 },
        chart: { cols: 2, rows: 3 },
        table: { cols: 4, rows: 4 },
      };
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public store: Store<AppState>
  ) {}
  ngDestroyed$: Subject<any> = new Subject<any>();
  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
  }
  ngOnInit(): void {
    this.displayCharts = false;
    for (let i = 0; i < 4; i++) {
      this.miniCardData[i] = new OrderSummary();
    }
    this.miniCardData[0].title = 'Total sales';
    this.miniCardData[1].title = 'Total orders';
    this.miniCardData[2].title = 'Average order value';
    this.miniCardData[3].title = 'Average profit per order';
    this.store.pipe(select(selectGetYears)).subscribe((years) => {
      this.years = years;
    });
  }

  getSelectedValue(): void {
    this.displayCharts = true;
    this.eventsSubject.next({ data: this.yearSelected });
    this.loadMiniCards();
  }

  loadMiniCards(): void {
    this.store.pipe(select(selectYear, { year: this.yearSelected })).subscribe({
      next: (summaryData) => {
        const totalSales = summaryData
          .map((furniture: { sales: number }) => furniture.sales)
          .reduce((prev: number, curr: number) => prev + curr, 0);
        const totalOrders = summaryData.map(
          (furniture: { orderId: string }) => furniture.orderId
        ).length;
        const toalProfit = summaryData
          .map((furniture: { profit: number }) => furniture.profit)
          .reduce((prev: number, curr: number) => prev + curr, 0);
        this.miniCardData[0].value = totalSales;
        this.miniCardData[0].isCurrency = true;
        this.miniCardData[1].value = totalOrders;
        this.miniCardData[2].value = (totalSales / totalOrders).toFixed(2);
        this.miniCardData[2].isCurrency = true;
        this.miniCardData[3].value = (toalProfit / totalOrders).toFixed(2);
        this.miniCardData[3].isCurrency = true;
      },
    });
  }
}
