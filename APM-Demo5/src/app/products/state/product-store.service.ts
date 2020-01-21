import { Injectable } from '@angular/core';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { initialState, ProductState, reducer } from './product.reducer';
import * as productActions from './product.actions';
import { ProductActions, ProductActionTypes } from './product.actions';
import { MiniStore, ofType } from '../../mini-store';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService extends MiniStore<ProductState, ProductActions> {

  // SELECTORS
  products$ = this.select<Product[]>([this.state$], (state) => state.products);
  currentProductId$ = this.select<number>([this.state$], (state: ProductState) => state.currentProductId);
  showProductCode$ = this.select<boolean>([this.state$], (state: ProductState) => state.showProductCode);
  errorMessage$ = this.select<string>([this.state$], (state: ProductState) => state.error);

  currentProduct$ = this.select<Product>([this.products$, this.currentProductId$, this.showProductCode$], (products, currentProductId) => {

      console.log('TEST'); // TODO

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
    });

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
  }
}
