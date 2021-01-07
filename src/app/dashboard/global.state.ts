import { DashboardState, initialDashboardState } from './dashboard.state';

export interface GlobalState {
  order: DashboardState;
}

export const initialGlobalState: GlobalState = {
  order: initialDashboardState,
};
