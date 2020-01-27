import { Injectable } from '@angular/core';
import { FeatureStore } from '../../feature-store';
import { reducer, UserState } from './user.reducer';
import { UserActions } from './user.actions';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends FeatureStore<UserState, UserActions> {

  constructor() {
    super('users', reducer);
  }
}
