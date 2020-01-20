import { merge, Observable, Subject } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

export class MiniStore<StateType, ActionType extends {type: string, payload: any}> {
  private actionsSource: Subject<ActionType> = new Subject();
  actions$: Observable<ActionType> = this.actionsSource.asObservable();

  private stateSource: Subject<StateType> = new Subject();
  state$: Observable<StateType> = this.stateSource.asObservable();

  constructor() {
    console.log('MINI STORE');
  }

  dispatch = (action: ActionType) => this.actionsSource.next(action);

  init(
    reducer: (state: StateType, action: ActionType) => StateType,
    effects$: Observable<ActionType>[] = []
  ) {
    merge(this.actions$, ...effects$).pipe(
      tap((action => console.log('Action', action.type, action.payload))),
      scan<ActionType, StateType>(reducer),
      tap(newState => this.stateSource.next(newState))
    ).subscribe();
  }
}
