import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ProductActions} from '../state/product.actions';

@Injectable({
  providedIn: 'root'
})
export class ProductActionsService {

  private actions: Subject<ProductActions> = new Subject();
  actions$ = this.actions.asObservable();

  constructor(

  ) {
  }

  dispatch(action: ProductActions) {
    this.actions.next(action);
  }
}
