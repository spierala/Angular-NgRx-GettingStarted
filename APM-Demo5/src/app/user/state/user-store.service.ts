import { Injectable } from '@angular/core';
import { FeatureStore } from '../../feature-store';
import { reducer, UserState } from './user.reducer';
import { UserActions } from './user.actions';
import { createSelector } from '@ngrx/store';
import {createFeatureSelector} from '../../mini-store.utils';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends FeatureStore<UserState, UserActions> {

  constructor() {
    super('user', reducer);
  }
}

export const getUserFeatureState = createFeatureSelector('user');

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);
