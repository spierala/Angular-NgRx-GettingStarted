import {Component} from '@angular/core';
import {getProducts, ProductStoreService} from './products/state/product-store.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private productStoreService: ProductStoreService
  ) {
    this.productStoreService.select(getProducts).pipe(
      tap((data) => console.log('app products$', data))
    ).subscribe();
  }
}
