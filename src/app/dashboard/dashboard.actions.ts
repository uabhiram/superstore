import { createAction, props } from '@ngrx/store';
import { Order } from './model/order';

export enum DashboardActionType {
  Loading = '[Order] Loading',
  LoadSuccess = '[Order] LoadSuccess',
  LoadFailure = '[Order] LoadFailure',
}

export const OrderLoadAction = createAction(DashboardActionType.Loading);

export const OrderLoadSuccessAction = createAction(
  DashboardActionType.LoadSuccess,
  props<{ orders: Order[] }>()
);

export const OrderLoadFailAction = createAction(
  DashboardActionType.LoadFailure,
  props<{ error: any }>()
);
