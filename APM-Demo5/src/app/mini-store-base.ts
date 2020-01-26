import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {Action} from './mini-store.utils';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';

class MiniStore {

  private actionsSource: Subject<Action> = new Subject();
  actions$: Observable<Action> = this.actionsSource.asObservable();

  private effects$: BehaviorSubject<Observable<Action>[]> = new BehaviorSubject([]);
  private effectActions: Observable<Action> = this.effects$.pipe(
    switchMap(effects => merge(...effects)),
  );

  private stateSource: BehaviorSubject<any> = new BehaviorSubject({});
  private state$: Observable<any> = this.stateSource.asObservable().pipe(
    // tap(globalState => console.log('GlobalState', globalState)),
    // share() // TODO
  );

  constructor() {
    this.effectActions.pipe(
      tap(action => this.dispatch(action))
    ).subscribe();
  }

  updateState(state, featureName) {
    const currentState = this.stateSource.getValue();
    const newState = {
      ...currentState
    };
    newState[featureName] = state;
    this.stateSource.next(newState);
  }

  dispatch = (action: Action) => this.actionsSource.next(action);

  select(mapFn: ((state: any) => any)) {
    return this.state$.pipe(
      map(state => mapFn(state)),
      distinctUntilChanged()
    );
  }

  addFeature(featureName: string) {
    const currentState = this.stateSource.getValue();
    if (!currentState.hasOwnProperty(featureName)) {
      currentState[featureName] = {};
    }
  }

  addEffect(effect: Observable<Action>) {
    this.effects$.next([...this.effects$.getValue(), effect]);
  }

  addEffects(effects: Observable<Action>[]) {
    this.effects$.next([...this.effects$.getValue(), ...effects]);
  }
}

// Created once to initialize singleton
const Store = new MiniStore();

export default Store;
export const actions$ = Store.actions$;
