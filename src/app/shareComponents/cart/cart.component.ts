import { Component, OnInit } from '@angular/core';
import {CartService} from '../../../Services/cart.service'
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public kitchenName = 'Gregory Denton';
  public orders:any;
  constructor(private cart:CartService) { }

  ngOnInit() {
    this.cart.checkCart.subscribe(res =>{

      console.log(res);
   });
  //   this.userService.checkCurrentUser.subscribe(res =>{
  //     this.Signin = !res;
  //     console.log("hit");
  //  });
  }
  
  AddMoreItem(item,kitchenid){
     this.cart.addOrder(item,kitchenid);
     this.cart.CartUpdate(this.cart.itemsOrder);
  }
  RemoveItem(item){
    this.cart.removeItem(item);
    this.cart.CartUpdate(this.cart.itemsOrder);
  }
  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  
}
