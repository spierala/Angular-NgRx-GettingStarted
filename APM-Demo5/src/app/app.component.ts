import { Component } from '@angular/core';
import { ProductStoreService } from './products/state/product-store.service';
import * as productActions from './products/state/product.actions';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private productStoreService: ProductStoreService
  ) {
    this.productStoreService.dispatch(new productActions.Load());
  }
}
