import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import * as productActions from './../../state/product.actions';
import {Product} from '../../product';
import {
  getCurrentProduct,
  getError,
  getProducts,
  getShowProductCode,
  ProductStoreService
} from '../../state/product-store.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;
  state$: Observable<any>;

  constructor(
    private productStoreService: ProductStoreService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productStoreService.select(getProducts).pipe(
      tap((data) => console.log('shell products$', data))
    );

    this.errorMessage$ = this.productStoreService.select(getError).pipe(
      tap((data) => console.log('shell errorMessage$', data))
    );

    this.selectedProduct$ = this.productStoreService.select(getCurrentProduct).pipe(
      // TODO: check why triggered twice when current product id changes
      tap((data) => console.log('shell currentProduct$', data))
    );

    this.displayCode$ = this.productStoreService.select(getShowProductCode).pipe(
      tap((data) => console.log('shell showProductCode$', data))
    );
  }

  checkChanged(value: boolean): void {
    this.productStoreService.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.productStoreService.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.productStoreService.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    this.productStoreService.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearProduct(): void {
    this.productStoreService.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    this.productStoreService.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    this.productStoreService.dispatch(new productActions.UpdateProduct(product));
  }
}
