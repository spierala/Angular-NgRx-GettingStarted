import { UserState } from './user.reducer';
import { createFeatureSelector, createSelector } from '../../mini-store.utils';


// Selector functions
const getUserFeatureState = createFeatureSelector('users');

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);
