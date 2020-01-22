import { Injectable } from '@angular/core';
import { MiniStore } from '../../mini-store';
import { initialState, reducer, UserState } from './user.reducer';
import { UserActions } from './user.actions';
import { createSelector } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends MiniStore<UserState, UserActions> {

  constructor() {
    super();

    this.init(reducer, initialState);
  }
}

export function getUserFeatureState(state: UserState) {
  return state;
}

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);
