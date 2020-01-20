import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { merge, Observable, of } from 'rxjs';
import { ProductState, reducer } from '../state/product.reducer';
import * as productActions from '../state/product.actions';
import { ProductActions, ProductActionTypes } from '../state/product.actions';
import { MiniStore } from './mini-store';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService extends MiniStore<ProductState, ProductActions> {

  // SELECTORS
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

  effects$: Observable<ProductActions> = merge(
    this.loadProducts$,
    this.updateProduct$,
    this.createProduct$,
    this.deleteProduct$
  );

  constructor(
    private productService: ProductService
  ) {
      super();
      this.init(reducer, this.effects$);
  }
}
