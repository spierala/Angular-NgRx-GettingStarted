import { Injectable } from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { initialState, ProductState, reducer } from './product.reducer';
import * as productActions from './product.actions';
import { ProductActions, ProductActionTypes } from './product.actions';
import { createSelector, MiniStore, ofType } from '../../mini-store';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService extends MiniStore<ProductState, ProductActions> {

  // EFFECTS
  private loadProducts$: Observable<ProductActions> = this.actions$.pipe(
    ofType(ProductActionTypes.Load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (new productActions.LoadSuccess(products))),
        catchError(err => of(new productActions.LoadFail(err)))
      )
    )
  );

  private updateProduct$: Observable<ProductActions> = this.actions$.pipe(
    ofType(ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );

  private createProduct$: Observable<ProductActions> = this.actions$.pipe(
    ofType(ProductActionTypes.CreateProduct),
    map((action: productActions.CreateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(newProduct => (new productActions.CreateProductSuccess(newProduct))),
        catchError(err => of(new productActions.CreateProductFail(err)))
      )
    )
  );

  private deleteProduct$: Observable<ProductActions> = this.actions$.pipe(
    ofType(ProductActionTypes.DeleteProduct),
    map((action: productActions.DeleteProduct) => action.payload),
    mergeMap((productId: number) =>
      this.productService.deleteProduct(productId).pipe(
        map(() => (new productActions.DeleteProductSuccess(productId))),
        catchError(err => of(new productActions.DeleteProductFail(err)))
      )
    )
  );

  constructor(
    private productService: ProductService
  ) {
    super();
    this.init(reducer, initialState, [
      // Effects
      this.loadProducts$,
      this.updateProduct$,
      this.createProduct$,
      this.deleteProduct$
    ]);

    this.dispatch(new productActions.Load());
  }
}

export function getProductFeatureState(state: ProductState) {
  console.log('selector getProductFeatureState');
  return state;
}

export const getShowProductCode = createSelector(
  getProductFeatureState,
  state => state.showProductCode
);

export const getCurrentProductId = createSelector(
  getProductFeatureState,
  state => {
    console.log('selector getCurrentProductId');
    return state.currentProductId;
  }
);

export const getProducts = createSelector(
  getProductFeatureState,
  state => {
    console.log('selector getProducts');
    return state.products;
  }
);

export const getCurrentProduct = createSelector(
  getProducts,
  getCurrentProductId,
  (products, currentProductId) => {
    console.log('CALC current product...', products, currentProductId);

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
  }
);

export const getFirstProduct = createSelector(
  getProducts,
  (products) => products[0]
);

export const getProductById = (id: number) => createSelector(
  getProducts,
  (products) => products.find(p => p.id === id)
);

export const getError = createSelector(
  getProductFeatureState,
  state => state.error
);
