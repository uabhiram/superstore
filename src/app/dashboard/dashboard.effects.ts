import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardHttpService } from './dashboard.service';
import { concatMap, map, catchError } from 'rxjs/operators';
import {
  OrderLoadSuccessAction,
  OrderLoadAction,
  OrderLoadFailAction,
} from './dashboard.actions';
import { of } from 'rxjs';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dashboardHttpService: DashboardHttpService
  ) {}
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderLoadAction),
      concatMap((Action) =>
        this.dashboardHttpService.findAllOrders().pipe(
          map((orders) => OrderLoadSuccessAction({ orders })),
          catchError((error) => of(OrderLoadFailAction({ error })))
        )
      )
    )
  );
}
