import { Component } from '@angular/core';
import * as productActions from './products/state/product.actions';
import Store from './mini-store-base';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(

  ) {
    Store.dispatch(new productActions.Load());
  }
}
