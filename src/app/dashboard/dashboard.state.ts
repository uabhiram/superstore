import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Order } from './model/order';

export interface DashboardState extends EntityState<Order> {
  error: boolean;
  allOrdersLoaded: boolean;
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id,
});

export const initialDashboardState: DashboardState = adapter.getInitialState({
  error: false,
  allOrdersLoaded: false,
});
