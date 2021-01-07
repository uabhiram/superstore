import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import {
  selectAllOrders,
  selectOrderTotal,
  areOrdersLoaded,
  selectOrdersError,
  selectSliceOrders,
} from '../dashboard.selectors';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, merge, Subject, Subscription, of, from } from 'rxjs';
import {
  tap,
  debounceTime,
  distinctUntilChanged,
  map,
  distinct,
  reduce,
  mergeMap,
} from 'rxjs/operators';
import { Order } from '../model/order';
import { AppState } from '../../shared/reducers';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
})
export class OrdersTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public displayedColumns: string[] = [
    'orderId',
    'orderDate',
    'productName',
    'shipMode',
    'quantity',
  ];
  public dataSource: MatTableDataSource<Order>;
  public OrdersTotal: number;
  public flag: boolean;
  public noData: Order[] = [<Order>{}];
  public loading: boolean;
  public error$: Observable<boolean>;
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'orderDate', direction: 'asc' };
  private filter = '';
  private subscription: Subscription = new Subscription();

  constructor(public store: Store<AppState>) {
    this.OrdersTotal = 0;
    this.flag = false;
    this.loading = false;
  }

  public ngOnInit(): void {
    this.flag = false;
    this.store
      .pipe(select(selectAllOrders))
      .subscribe((orders) => this.initializeData(orders));
    this.store
      .pipe(select(selectOrderTotal))
      .subscribe((total) => (this.OrdersTotal = total));
    this.subscription.add(
      this.store.pipe(select(areOrdersLoaded)).subscribe((loading) => {
        console.log('loado' + loading);
        if (!loading) {
          this.dataSource = new MatTableDataSource(this.noData);
        }
        this.loading = !loading;
      })
    );
    this.error$ = this.store.pipe(select(selectOrdersError));
  }

  public ngAfterViewInit(): void {
    this.loadCustomers();
    const filter$ = this.filterSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap((value: string) => {
        this.paginator.pageIndex = 0;
        this.filter = value;
      })
    );

    const sort$ = this.sort.sortChange.pipe(
      tap(() => (this.paginator.pageIndex = 0))
    );

    this.subscription.add(
      merge(filter$, sort$, this.paginator.page)
        .pipe(tap(() => this.loadCustomers()))
        .subscribe()
    );
  }
  private loadCustomers(): void {
    this.store
      .pipe(
        select(selectSliceOrders, {
          filter: this.filter.toLocaleLowerCase(),
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          sortDirection: this.sort.direction,
          sortField: this.sort.active,
        })
      )
      .subscribe((orders) => this.initializeData(orders));
  }

  private initializeData(orders: Order[]): void {
    this.dataSource = new MatTableDataSource(
      orders.length ? orders : this.noData
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public retry(): void {
    this.loadCustomers();
  }

  public search(event: any): void {
    this.filterSubject.next(event.target.value);
  }
}
