import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public kitchenName = 'Gregory Denton';
  constructor() { }

  ngOnInit() {
  }
  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
}
