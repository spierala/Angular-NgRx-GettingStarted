import { combineLatest, merge, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
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
  actions$: Observable<ActionType> = this.actionsSource.asObservable();

  private stateSource: Subject<StateType> = new Subject();
  state$: Observable<StateType> = this.stateSource.asObservable().pipe(
    publishReplay(1),
    refCount()
    // share()
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

  select<T>(obs: Observable<any>[], projector: (...args: any[]) => T): Observable<T> {
    return combineLatest(...obs).pipe(
      map((resultArr) => projector(...resultArr)),
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
