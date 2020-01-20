import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import * as productActions from './../../state/product.actions';
import {Product} from '../../product';
import {ProductActionsService} from '../../action-driven-state/product-actions.service';
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

  constructor(
    private productStoreService: ProductStoreService,
    private productActionsService: ProductActionsService
  ) {}

  ngOnInit(): void {
    this.productActionsService.dispatch(new productActions.Load());
    this.products$ = this.productStoreService.products$;
    this.errorMessage$ = this.productStoreService.errorMessage$;
    this.selectedProduct$ = this.productStoreService.currentProduct$;
    this.displayCode$ = this.productStoreService.showProductCode$;
  }

  checkChanged(value: boolean): void {
    this.productActionsService.dispatch(new productActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.productActionsService.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.productActionsService.dispatch(new productActions.SetCurrentProduct(product));
  }

  deleteProduct(product: Product): void {
    this.productActionsService.dispatch(new productActions.DeleteProduct(product.id));
  }

  clearProduct(): void {
    this.productActionsService.dispatch(new productActions.ClearCurrentProduct());
  }
  saveProduct(product: Product): void {
    this.productActionsService.dispatch(new productActions.CreateProduct(product));
  }

  updateProduct(product: Product): void {
    this.productActionsService.dispatch(new productActions.UpdateProduct(product));
  }
}
