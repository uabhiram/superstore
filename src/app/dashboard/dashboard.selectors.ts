import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';
import * as fromOrders from './reducers/dashboard.reducers';

export const selectOrderState = createFeatureSelector<DashboardState>('orders');

export const selectAllOrders = createSelector(
  selectOrderState,
  fromOrders.selectAll
);

export const selectOrderTotal = createSelector(
  selectAllOrders,
  (orders) => orders.filter((order) => order).length
);

export const areOrdersLoaded = createSelector(
  selectOrderState,
  (state) => state.allOrdersLoaded
);

export const selectOrdersError = createSelector(
  selectOrderState,
  (state) => state.error
);

export const selectOrdersTable = createSelector(
  selectAllOrders,
  (orders: any, params: any) =>
    orders.filter(
      (c: { orderId: string; productName: any }) =>
        ~c.orderId.toLocaleLowerCase().indexOf(params.filter) ||
        ~c.productName.toLocaleLowerCase().indexOf(params.filter)
    )
);

export const selectSortOrders = createSelector(
  selectOrdersTable,
  (orders, params) =>
    orders.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        (a[params.sortField] > b[params.sortField] ? 1 : -1) *
        (params.sortDirection === 'asc' ? 1 : -1)
    )
);

export const selectSliceOrders = createSelector(
  selectSortOrders,
  (orders, params) =>
    orders.slice(
      params.pageIndex * params.pageSize,
      (params.pageIndex + 1) * params.pageSize
    )
);
export const selectGetCategories = createSelector(selectAllOrders, (state) =>
  state
    .map((orders: { category: string }) => orders.category)
    .filter(
      (value: any, index: any, self: string | any[]) =>
        self.indexOf(value) === index
    )
);
export const selectGetSubCategories = createSelector(
  selectAllOrders,
  (orders: any[], params: { category: string }) =>
    orders
      .filter(
        (categories: { category: string }) =>
          categories.category === params.category
      )
      .map((categories: { subcategory: string }) => categories.subcategory)
      .filter(
        (value: any, index: any, self: any[]) => self.indexOf(value) === index
      )
);
export const selectGetYears = createSelector(selectAllOrders, (state) =>
  state
    .map((furniture: { orderDate: string }) => furniture.orderDate)
    .map((orderDate: string) => orderDate.split('/').pop())
    .filter(
      (value: any, index: any, self: string | any[]) =>
        self.indexOf(value) === index
    )
);
export const selectYear = createSelector(
  selectAllOrders,
  (orders: any[], params: { year: string }) =>
    orders.filter(
      (order: { orderDate: string }) =>
        order.orderDate.split('/').pop() === params.year
    )
);

export const selectYearCategory = createSelector(
  selectYear,
  (orders: any[], params: { year: string; category: string }) =>
    orders.filter((order) => order.category == params.category)
);
