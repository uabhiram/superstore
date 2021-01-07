import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../shared/reducers';
import { select, Store } from '@ngrx/store';
import { finalize, first, tap } from 'rxjs/operators';
import { OrderLoadAction } from './dashboard.actions';
import { areOrdersLoaded } from './dashboard.selectors';

@Injectable()
export class DashboardResolver implements Resolve<any> {
  loading = false;

  constructor(private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.store.pipe(
      select(areOrdersLoaded),
      tap((ordersLoaded) => {
        if (!this.loading && !ordersLoaded) {
          this.loading = true;
          this.store.dispatch(OrderLoadAction());
        }
      }),
      first(),
      finalize(() => (this.loading = false))
    );
  }
}
