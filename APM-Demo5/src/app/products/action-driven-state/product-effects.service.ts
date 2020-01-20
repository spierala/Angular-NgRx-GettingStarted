import {Injectable} from '@angular/core';
import {catchError, filter, map, mergeMap} from 'rxjs/operators';
import {ProductService} from '../product.service';
import {ProductActionsService} from './product-actions.service';
import {merge, Observable, of} from 'rxjs';
import * as productActions from '../state/product.actions';
import {ProductActions, ProductActionTypes} from '../state/product.actions';
import {Product} from '../product';

@Injectable({
  providedIn: 'root'
})
export class ProductEffectsService {

  private loadProducts$: Observable<ProductActions> = this.productActionsService.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.Load),
    mergeMap(action =>
      this.productService.getProducts().pipe(
        map(products => (new productActions.LoadSuccess(products))),
        catchError(err => of(new productActions.LoadFail(err)))
      )
    )
  );

  private updateProduct$: Observable<ProductActions> = this.productActionsService.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );

  private createProduct$: Observable<ProductActions> = this.productActionsService.actions$.pipe(
    filter((action: ProductActions) => action.type === ProductActionTypes.CreateProduct),
    map((action: productActions.CreateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(newProduct => (new productActions.CreateProductSuccess(newProduct))),
        catchError(err => of(new productActions.CreateProductFail(err)))
      )
    )
  );

  private deleteProduct$: Observable<ProductActions> = this.productActionsService.actions$.pipe(
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
    private productService: ProductService,
    private productActionsService: ProductActionsService
  ) {

  }
}
