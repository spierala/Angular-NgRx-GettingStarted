import { Injectable } from '@angular/core';
import {catchError, filter, map, mergeMap, share, tap} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import {initialState, ProductState, reducer} from './product.reducer';
import * as productActions from './product.actions';
import { ProductActions, ProductActionTypes } from './product.actions';
import { MiniStore } from '../../mini-store';
import { Product } from '../product';
import { ProductService } from '../product.service';
import {UserStoreService} from '../../user/state/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService extends MiniStore<ProductState, ProductActions> {

  // SELECTORS
  products$ = this.state$.pipe(
    map(state => state.products)
  );

  showProductCode$ = this.state$.pipe(
    map(state => {
      debugger
      return state.showProductCode
    })
  );

  errorMessage$ = this.state$.pipe(
    map(state => state.error)
  );

  currentProduct$ = this.state$.pipe(
    map((state) => {

      debugger // TODO check why triggered twice...

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
    }),
    // share()
  );

  // EFFECTS
  private loadProducts$: Observable<ProductActions> = this.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.Load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (new productActions.LoadSuccess(products))),
        catchError(err => of(new productActions.LoadFail(err)))
      )
    )
  );

  private updateProduct$: Observable<ProductActions> = this.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );

  private createProduct$: Observable<ProductActions> = this.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.CreateProduct),
    map((action: productActions.CreateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(newProduct => (new productActions.CreateProductSuccess(newProduct))),
        catchError(err => of(new productActions.CreateProductFail(err)))
      )
    )
  );

  private deleteProduct$: Observable<ProductActions> = this.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.DeleteProduct),
    map((action: productActions.DeleteProduct) => action.payload),
    mergeMap((productId: number) =>
      this.productService.deleteProduct(productId).pipe(
        map(() => (new productActions.DeleteProductSuccess(productId))),
        catchError(err => of(new productActions.DeleteProductFail(err)))
      )
    )
  );

  constructor(
    private productService: ProductService,
    private userStoreService: UserStoreService
  ) {
      super();
      this.init(reducer, initialState, [
        // Effects
        // this.loadProducts$,
        // this.updateProduct$,
        // this.createProduct$,
        // this.deleteProduct$
      ]);
  }
}
