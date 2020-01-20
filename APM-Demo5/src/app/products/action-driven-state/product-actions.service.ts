import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Product} from '../product';

export enum ProductActionTypes2 {
  ToggleProductCode = '[Product] Toggle Product Code',
  SetCurrentProduct = '[Product] Set Current Product',
  ClearCurrentProduct = '[Product] Clear Current Product',
  InitializeCurrentProduct = '[Product] Initialize Current Product',
  Load = '[Product] Load',
  LoadSuccess = '[Product] Load Success',
  LoadFail = '[Product] Load Fail',
  UpdateProduct = '[Product] Update Product',
  UpdateProductSuccess = '[Product] Update Product Success',
  UpdateProductFail = '[Product] Update Product Fail',
  CreateProduct = '[Product] Create Product',
  CreateProductSuccess = '[Product] Create Product Success',
  CreateProductFail = '[Product] Create Product Fail',
  DeleteProduct = '[Product] Delete Product',
  DeleteProductSuccess = '[Product] Delete Product Success',
  DeleteProductFail = '[Product] Delete Product Fail'
}

// Action Creators
export class ToggleProductCode {
  readonly type = ProductActionTypes2.ToggleProductCode;

  constructor(public payload: boolean) { }
}

export class SetCurrentProduct {
  readonly type = ProductActionTypes2.SetCurrentProduct;

  constructor(public payload: Product) { }
}

export class Load {
  readonly type = ProductActionTypes2.Load;
}

export class LoadSuccess {
  readonly type = ProductActionTypes2.LoadSuccess;

  constructor(public payload: Product[]) { }
}

export class LoadFail {
  readonly type = ProductActionTypes2.LoadFail;

  constructor(public payload: string) { }
}

// Union the valid types
export type ProductActions2 = ToggleProductCode |
  SetCurrentProduct | Load | LoadSuccess | LoadFail;


@Injectable({
  providedIn: 'root'
})
export class ProductActionsService {

  private actions: Subject<ProductActions2> = new Subject();
  actions$ = this.actions.asObservable();

  constructor(

  ) {
  }

  dispatch(action: ProductActions2) {
    this.actions.next(action);
  }
}
