import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, scan, share, tap } from 'rxjs/operators';

export class MiniStore<StateType, ActionType extends { type: string, payload?: any }> {
  private actionsSource: BehaviorSubject<ActionType> = new BehaviorSubject({type: 'init'} as ActionType); // TODO 'init' ?!
  actions$: Observable<ActionType> = this.actionsSource.asObservable();

  private stateSource: Subject<StateType> = new Subject();
  state$: Observable<StateType> = this.stateSource.asObservable().pipe(
    tap(() => console.log('SELECTOR: state$')),
    share()
  );

  constructor() {
    console.log('MINI STORE READY');
  }

  init(
    reducer: (state: StateType, action: ActionType) => StateType,
    initialState: StateType,
    effects$: Observable<ActionType>[] = []
  ) {
    merge(this.actions$, ...effects$).pipe(
      tap((action => console.log('Action', action.type, action.payload))),
      scan<ActionType, StateType>(reducer, initialState),
      distinctUntilChanged(),
      tap(newState => {
        this.stateSource.next(newState);
        console.log('New State', newState);
      }),
    ).subscribe();
  }

  dispatch = (action: ActionType) => this.actionsSource.next(action);

  select<T>(obs: Observable<any>[], projector: (...args: any[]) => T): Observable<T> {
    return combineLatest(...obs).pipe(
      map((resultArr) => projector(...resultArr)),
      distinctUntilChanged(),
      share()
    );
  }
}
