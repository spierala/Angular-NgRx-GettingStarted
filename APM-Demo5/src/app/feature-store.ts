import {distinctUntilChanged, scan, tap} from 'rxjs/operators';
import {Action, createFeatureSelector} from './mini-store.utils';
import Store, {actions$} from './mini-store-base';
import {Observable} from 'rxjs';

export class FeatureStore<StateType, ActionType extends Action> {

  constructor(
    private featureName: string,
    reducer: (state: StateType, action: ActionType) => StateType,
  ) {

    Store.addFeature(featureName);

    console.log('MINI STORE READY', featureName);

    actions$.pipe(
      tap((action => console.log('Action: ', action.type, action.payload))),
      scan<ActionType, StateType>(reducer, undefined),
      distinctUntilChanged(),
      tap(newState => {
        console.log('New State: ', newState);
        Store.updateState(newState, this.featureName);
      })
    ).subscribe(); // TODO get rid of subscription?
  }

  state$: Observable<StateType> = Store.select(createFeatureSelector(this.featureName));

  dispatch = (action: ActionType) => Store.dispatch(action);

  select = (mapFn: ((state: any) => any)) => Store.select(mapFn);

  // TODO Add clean up logic ?
}
