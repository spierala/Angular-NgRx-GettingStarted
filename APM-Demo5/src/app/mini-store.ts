import { merge, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  scan,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import { OnDestroy } from '@angular/core';

export class MiniStore<StateType, ActionType extends Action> implements OnDestroy {
  private actionsSource: Subject<ActionType> = new Subject();
  actions$: Observable<ActionType> = this.actionsSource.asObservable(); // TODO make actions private?

  private stateSource: Subject<StateType> = new Subject();
  private state$: Observable<StateType> = this.stateSource.asObservable().pipe(
    publishReplay(1),
    refCount()
  );

  private unsubscribe$ = new Subject();

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
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  dispatch = (action: ActionType) => this.actionsSource.next(action);

  select(mapFn: ((state: any) => any)) {
      return this.state$.pipe(
        map(source => mapFn(source)),
        distinctUntilChanged(),
        publishReplay(1),
        refCount()
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    console.log('MINI STORE DESTROYED', this.constructor.name);
  }
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

  return (state) => {
    const selectorResults = selectors.map(fn => fn(state));
    return projector.apply(null, selectorResults as any);
  };
}
