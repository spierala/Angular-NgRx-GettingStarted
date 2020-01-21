import {BehaviorSubject, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, scan, share, startWith, tap} from 'rxjs/operators';

export class MiniStore<StateType, ActionType extends { type: string, payload?: any }> {
  private actionsSource: BehaviorSubject<ActionType> = new BehaviorSubject({type: 'init'} as ActionType); // TODO
  actions$: Observable<ActionType> = this.actionsSource.asObservable().pipe(share());

  private stateSource: Subject<StateType> = new Subject();
  state$: Observable<StateType> = this.stateSource.asObservable().pipe(share());

  constructor() {
    console.log('MINI STORE');
  }

  dispatch = (action: ActionType) => this.actionsSource.next(action);

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
}
