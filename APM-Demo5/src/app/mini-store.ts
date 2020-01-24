import { merge, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  scan,
  startWith,
  tap
} from 'rxjs/operators';
import memoizeOne from 'memoize-one';

export class MiniStore<StateType, ActionType extends Action> {

  private actionsSource: Subject<ActionType> = new Subject();
  actions$: Observable<ActionType> = this.actionsSource.asObservable(); // TODO make actions private?

  private stateSource: Subject<StateType> = new Subject();
  private state$: Observable<StateType> = this.stateSource.asObservable().pipe(
    publishReplay(1),
    refCount()
  );

  constructor() {
    console.log('MINI STORE READY', this.constructor.name);
  }

  init(
    reducer: (state: StateType, action: ActionType) => StateType,
    initialState: StateType,
    effects$: Observable<ActionType>[] = []
  ) {
    merge(this.actions$, ...effects$).pipe(
      tap((action => console.log('Action: ', action.type, action.payload))),
      startWith(initialState),
      scan<ActionType, StateType>(reducer),
      distinctUntilChanged(),
      tap(newState => {
        console.log('New State: ', newState);
        this.stateSource.next(newState);
      })
    ).subscribe(); // TODO get rid of subscription?
  }

  dispatch = (action: ActionType) => this.actionsSource.next(action);

  select(mapFn: ((state: any) => any)) {
    return this.state$.pipe(
      map(source => mapFn(source)),
      distinctUntilChanged()
    );
  }

  // TODO Add clean up logic ?
}

export interface Action {
  type: string;
  payload?: any;
}

export function ofType<T extends Action>(
  type: string
): MonoTypeOperatorFunction<T> {
  return filter((action) => type === action.type);
}

export function createSelector(...args: any[]) {
  const selectors = args.slice(0, args.length - 1);
  const projector = args[args.length - 1];
  const memoizedProjector = memoizeOne(projector); // TODO add memoize function to src ?

  return (state) => {
    const selectorResults = selectors.map(fn => fn(state));
    return memoizedProjector.apply(null, selectorResults);
  };
}
