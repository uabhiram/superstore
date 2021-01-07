import { ActionReducerMap } from '@ngrx/store';
import { GlobalState } from '../global.state';
import { DashboardReducer } from './dashboard.reducers';

export const reducers: ActionReducerMap<GlobalState> = {
  order: DashboardReducer,
};
