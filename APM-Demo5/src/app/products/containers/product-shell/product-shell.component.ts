import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as productActions from './../../state/product.actions';
import { Product } from '../../product';
import { tap } from 'rxjs/operators';
import MiniStore from '../../../mini-store-base';
import { getCurrentProduct, getError, getProducts, getShowProductCode } from '../../state';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;

  constructor(

  ) {

  }

  ngOnInit(): void {
    this.products$ = MiniStore.select(getProducts).pipe(
      tap((data) => console.log('shell products$', data))
    );

    this.errorMessage$ = MiniStore.select(getError).pipe(
      tap((data) => console.log('shell errorMessage$', data))
    );

    this.selectedProduct$ = MiniStore.select(getCurrentProduct).pipe(
      // TODO: check why triggered twice when current product id changes
      tap((data) => console.log('shell currentProduct$', data))
    );

    this.displayCode$ = MiniStore.select(getShowProductCode).pipe(
      tap((data) => console.log('shell showProductCode$', data))
    );
  }

  checkChanged(value: boolean): void {
    MiniStore.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    MiniStore.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    MiniStore.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    MiniStore.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearProduct(): void {
    MiniStore.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    MiniStore.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    MiniStore.dispatch(new productActions.UpdateProduct(product));
  }
}
