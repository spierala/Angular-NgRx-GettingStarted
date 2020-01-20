import {Injectable} from '@angular/core';
import {ProductActions2, ProductActionsService, ProductActionTypes2} from './product-actions.service';
import {map, tap, withLatestFrom} from 'rxjs/operators';
import {BehaviorSubject, merge} from 'rxjs';
import {Product} from '../product';
import {ProductEffectsService} from './product-effects.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService {

  private showProductCodeSource: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private currentProductIdSource: BehaviorSubject<number | null> = new BehaviorSubject(null);
  private productsSource: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  private errorSource: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private productActionsService: ProductActionsService,
    private productEffectsService: ProductEffectsService
  ) {
    merge(
      this.productActionsService.actions$,
      this.productEffectsService.effects$
    ).pipe(
      tap((action: ProductActions2) => {
        switch (action.type) {
          case ProductActionTypes2.ToggleProductCode:
            return this.showProductCodeSource.next(action.payload);
            break;

          case ProductActionTypes2.SetCurrentProduct:
            this.currentProductIdSource.next(action.payload.id);
            break;

          case ProductActionTypes2.LoadSuccess:
            this.productsSource.next(action.payload);
            break;

          case ProductActionTypes2.LoadFail:
            this.productsSource.next([]);
            this.errorSource.next(action.payload);
            break;
        }
      })
    ).subscribe();
  }

  // Public Select State
  showProductCode$ = this.showProductCodeSource.asObservable();

  // showProductCode$ = this.productActionsService.actions$.pipe(
  //   filter(action => action.type === ProductActionTypes2.ToggleProductCode),
  //   map((action: ToggleProductCode) => action.payload)
  // );

  products$ = this.productsSource.asObservable();

  currentProduct$ = this.currentProductIdSource.pipe(
    withLatestFrom(this.productsSource),
    map(([currentProductId, products]) => {
      if (currentProductId === 0) {
        return {
          id: 0,
          productName: '',
          productCode: 'New',
          description: '',
          starRating: 0
        };
      } else {
        return currentProductId ? products.find(p => p.id === currentProductId) : null;
      }
    })
  );
}
