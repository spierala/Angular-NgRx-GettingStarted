import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromProduct from './../../state';
import * as productActions from './../../state/product.actions';
import { Product } from '../../product';
import {ProductActionsService} from '../../action-driven-state/product-actions.service';
import * as productActions2 from './../../action-driven-state/product-actions.service';
import {ProductStoreService} from '../../action-driven-state/product-store.service';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {
  displayCode$: Observable<boolean>;
  selectedProduct$: Observable<Product>;
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;
  test$: Observable<boolean>;

  constructor(
    private store: Store<fromProduct.State>,
    private productStoreService: ProductStoreService,
    private productActionsService: ProductActionsService
  ) {}

  ngOnInit(): void {
    // this.store.dispatch(new productActions.Load());
    this.productActionsService.dispatch(new productActions2.Load());
    // this.products$ = this.store.pipe(select(fromProduct.getProducts));
    this.products$ = this.productStoreService.products$;
    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));
    this.selectedProduct$ = this.store.pipe(select(fromProduct.getCurrentProduct));
    this.displayCode$ = this.store.pipe(select(fromProduct.getShowProductCode));

    this.test$ = this.productStoreService.showProductCode$;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    this.store.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearProduct(): void {
    this.store.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    this.store.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    this.store.dispatch(new productActions.UpdateProduct(product));
  }

  test() {
    this.productActionsService.dispatch(new productActions2.ToggleProductCode(false));
  }
}
