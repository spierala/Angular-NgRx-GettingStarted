import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Action} from './mini-store.utils';
import {share, tap} from 'rxjs/operators';

class MiniStoreBase {
  private actionsSource: Subject<Action> = new Subject();
  actions$: Observable<any> = this.actionsSource.asObservable();

  private stateSource: BehaviorSubject<any> = new BehaviorSubject({});
  state$: Observable<any> = this.stateSource.asObservable().pipe(
    tap(globalState => console.log('GlobalState', globalState)),
    share() // TODO
  );

  updateState(state, featureName) {
    const currentState = this.stateSource.getValue();
    const newState = {
      ...currentState
    };
    newState[featureName] = state;
    this.stateSource.next(newState);
  }

  dispatch = (action: Action) => this.actionsSource.next(action);

  addFeatureStore(featureName: string) {
    const currentState = this.stateSource.getValue();
    if (!currentState.hasOwnProperty(featureName)) {
      currentState[featureName] = {};
    }
  }
}

// Created once to initialize singleton
export default new MiniStoreBase();
