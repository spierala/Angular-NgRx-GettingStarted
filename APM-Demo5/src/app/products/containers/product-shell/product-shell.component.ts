import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import * as productActions from './../../state/product.actions';
import {Product} from '../../product';
import {
  getCurrentProduct,
  getError, getFirstProduct, getProductById,
  getProducts,
  getShowProductCode,
} from '../../state/product-store.service';
import { tap } from 'rxjs/operators';
import Store from '../../../mini-store-base';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  product$: Observable<Product>;
  productById$: Observable<Product>;
  errorMessage$: Observable<string>;

  constructor(

  ) {}

  ngOnInit(): void {
    this.products$ = Store.select(getProducts).pipe(
      tap((data) => console.log('shell products$', data))
    );

    this.errorMessage$ = Store.select(getError).pipe(
      tap((data) => console.log('shell errorMessage$', data))
    );

    this.selectedProduct$ = Store.select(getCurrentProduct).pipe(
      // TODO: check why triggered twice when current product id changes
      tap((data) => console.log('shell currentProduct$', data))
    );

    this.displayCode$ = Store.select(getShowProductCode).pipe(
      tap((data) => console.log('shell showProductCode$', data))
    );

    this.product$ = Store.select(getFirstProduct);

    this.productById$ = Store.select(getProductById(1));
  }

  checkChanged(value: boolean): void {
    Store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    Store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    Store.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    Store.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearProduct(): void {
    Store.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    Store.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    Store.dispatch(new productActions.UpdateProduct(product));
  }
}
