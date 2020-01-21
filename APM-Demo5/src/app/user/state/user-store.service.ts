import { Injectable } from '@angular/core';
import {MiniStore} from '../../mini-store';
import { initialState, reducer, UserState } from './user.reducer';
import {UserActions, UserActionTypes} from './user.actions';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService extends MiniStore<UserState, UserActions> {

  maskUserName$ = this.state$.pipe(
    map(state => state.maskUserName)
  );

  constructor() {
    super();

    this.init(reducer, initialState);
  }
}
