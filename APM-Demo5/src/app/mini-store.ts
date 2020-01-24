import {merge, Observable} from 'rxjs';
import {distinctUntilChanged, map, scan, startWith, tap} from 'rxjs/operators';
import {Action} from './mini-store.utils';
import MiniStoreBase from './mini-store-base';

export class MiniStore<StateType, ActionType extends Action> {

  actions$ = MiniStoreBase.actions$;

  constructor(
    private featureName: string
  ) {
    console.log('MINI STORE READY', this.constructor.name);
  }

  init(
    reducer: (state: StateType, action: ActionType) => StateType,
    initialState: StateType,
    effects$: Observable<ActionType>[] = []
  ) {

    MiniStoreBase.addFeatureStore(this.featureName);

    merge(MiniStoreBase.actions$, ...effects$).pipe(
      tap((action => console.log('Action: ', action.type, action.payload))),
      startWith(initialState),
      scan<ActionType, StateType>(reducer),
      distinctUntilChanged(),
      tap(newState => {
        console.log('New State: ', newState);
        MiniStoreBase.updateState(newState, this.featureName);
      })
    ).subscribe(); // TODO get rid of subscription?
  }

  dispatch = (action: ActionType) => MiniStoreBase.dispatch(action);

  select(mapFn: ((state: any) => any)) {
    return MiniStoreBase.state$.pipe(
      map(state => mapFn(state[this.featureName])),
      distinctUntilChanged()
    );
  }

  // TODO Add clean up logic ?
}
