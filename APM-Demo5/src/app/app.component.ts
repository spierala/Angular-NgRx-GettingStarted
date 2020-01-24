import { Component } from '@angular/core';
import memoizeOne from 'memoize-one';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    const add = (a, b) => {
      console.log('add', a, b);
    };

    const memAdd = memoizeOne(add);

    memAdd(1, 4);
  }
}
