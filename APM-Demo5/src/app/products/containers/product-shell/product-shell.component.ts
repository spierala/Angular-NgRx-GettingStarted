import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import * as productActions from './../../state/product.actions';
import {Product} from '../../product';
import {ProductStoreService} from '../../state/product-store.service';

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
    private productStoreService: ProductStoreService
  ) {}

  ngOnInit(): void {
    this.productStoreService.dispatch(new productActions.Load());
    this.products$ = this.productStoreService.products$;
    this.errorMessage$ = this.productStoreService.errorMessage$;
    this.selectedProduct$ = this.productStoreService.currentProduct$;
    this.displayCode$ = this.productStoreService.showProductCode$;
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
