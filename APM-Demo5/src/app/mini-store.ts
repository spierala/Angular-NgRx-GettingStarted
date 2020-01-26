import {merge, Observable} from 'rxjs';
import {distinctUntilChanged, map, scan, startWith, tap} from 'rxjs/operators';
import {Action} from './mini-store.utils';
import MiniStoreBase, {actions$} from './mini-store-base';

export class MiniStore<StateType, ActionType extends Action> {

  constructor(
    private featureName: string
  ) {
    console.log('MINI STORE READY', this.constructor.name);
  }

  init(
    reducer: (state: StateType, action: ActionType) => StateType
  ) {

    MiniStoreBase.addFeatureStore(this.featureName);

    actions$.pipe(
      tap((action => console.log('Action: ', action.type, action.payload))),
      scan<ActionType, StateType>(reducer, undefined),
      distinctUntilChanged(),
      tap(newState => {
        console.log('New State: ', newState);
        MiniStoreBase.updateState(newState, this.featureName);
      })
    ).subscribe(); // TODO get rid of subscription?
  }

  // TODO Add clean up logic ?
}
