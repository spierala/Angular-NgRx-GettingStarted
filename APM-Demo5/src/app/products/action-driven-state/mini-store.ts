import { merge, Observable, Subject } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

export class MiniStore<StateType, ActionType extends {type: string}> {
  private actionsSource: Subject<ActionType> = new Subject();
  actions$: Observable<ActionType> = this.actionsSource.asObservable();

  private stateSource: Subject<StateType> = new Subject();
  state$: Observable<StateType> = this.stateSource.asObservable();

  constructor() {
    console.log('MINI STORE');
  }

  dispatch = (action: ActionType) => this.actionsSource.next(action);

  init(reducer: (state: StateType, action: ActionType) => StateType, effects$?: Observable<any>) {

    const actions$: Observable<ActionType> = effects$ ? merge(this.actions$, effects$) : this.actions$;

    actions$.pipe(
      tap((action => console.log('Action', action.type, action.payload))),
      scan<any>(reducer),
      tap(newState => this.stateSource.next(newState))
    ).subscribe();
  }
}
