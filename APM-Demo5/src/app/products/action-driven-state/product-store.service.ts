import {Injectable} from '@angular/core';
import {ProductActionsService} from './product-actions.service';
import {map, scan, share, tap} from 'rxjs/operators';
import {merge, Observable} from 'rxjs';
import {ProductEffectsService} from './product-effects.service';
import {ProductState, reducer} from '../state/product.reducer';
import {ProductActions} from '../state/product.actions';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService {

  private state$: Observable<ProductState> = merge(
    this.productActionsService.actions$,
    this.productEffectsService.effects$
  ).pipe(
    tap((action => console.log('Action', action.type, action.payload))),
    scan<any>(reducer),
    share()
  );

  products$ = this.state$.pipe(
    map(state => state.products)
  );

  showProductCode$ = this.state$.pipe(
    map(state => state.showProductCode)
  );

  errorMessage$ = this.state$.pipe(
    map(state => state.error)
  );

  currentProduct$ = this.state$.pipe(
    map((state) => {
      if (state.currentProductId === 0) {
        return {
          id: 0,
          productName: '',
          productCode: 'New',
          description: '',
          starRating: 0
        };
      } else {
        return state.currentProductId ? state.products.find(p => p.id === state.currentProductId) : null;
      }
    })
  );

  constructor(
    private productActionsService: ProductActionsService,
    private productEffectsService: ProductEffectsService
  ) {
    this.state$.subscribe();
  }

  dispatch = (action: ProductActions) => this.productActionsService.dispatch(action);
}
