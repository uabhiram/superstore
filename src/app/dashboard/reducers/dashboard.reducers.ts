import { createReducer, on } from '@ngrx/store';
import { OrderActions } from '../action-types';
import { initialDashboardState, adapter } from '../dashboard.state';

export const DashboardReducer = createReducer(
  initialDashboardState,
  on(OrderActions.OrderLoadSuccessAction, (state, action) =>
    adapter.setAll(action.orders, {
      ...state,
      error: false,
      allOrdersLoaded: true,
    })
  ),
  on(OrderActions.OrderLoadFailAction, (state, action) =>
    adapter.removeAll({
      ...state,
      error: false,
      allOrdersLoaded: false,
      // total: 0
    })
  )
);

export const { selectAll } = adapter.getSelectors();
