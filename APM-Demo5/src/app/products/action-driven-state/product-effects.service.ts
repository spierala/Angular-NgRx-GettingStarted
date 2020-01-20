import {Injectable} from '@angular/core';
import {ProductActions2, ProductActionsService, ProductActionTypes2} from './product-actions.service';
import {catchError, filter, map, mergeMap, tap} from 'rxjs/operators';
import {ProductService} from '../product.service';
import * as productActions2 from './product-actions.service';
import {merge, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductEffectsService {

  effects$: Observable<productActions2.ProductActions2> = merge(

    this.productActionsService.actions$.pipe(
      filter((action: ProductActions2) => action.type === ProductActionTypes2.Load),
      mergeMap(action =>
        this.productService.getProducts().pipe(
          map(products => (new productActions2.LoadSuccess(products))),
          catchError(err => of(new productActions2.LoadFail(err)))
        )
      ),
    )

  );

  constructor(
    private productService: ProductService,
    private productActionsService: ProductActionsService
  ) {

  }
}
