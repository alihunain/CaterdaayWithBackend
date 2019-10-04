import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {CartService} from '../../../Services/cart.service'
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public kitchenName = 'Gregory Denton';
  public orders:any;
  constructor(private cart:CartService,private toastr:ToastrService) { }

  ngOnInit() {
    this.orders = this.cart.getItemOrder();
    this.cart.checkCart.subscribe(res =>{
      this.orders = res;
      console.log(this.orders);
    });
  }
  RemoveCombo(items){
    this.cart.RemoveCombo(items).then(()=>{
      this.toastr.success("Item Remove");
    })
  }

  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  













  //   Plus(item,kitchenid){
//      this.cart.PlusItem(item,kitchenid);
// console.log(item,"AD MORE ITEM")
//      this.cart.CartUpdate(this.cart.itemsOrder);
//   }
//   Minus(item){
//      if(item.qty==1){
       
//        return;
//      }
//     this.cart.MinusItem(item);
//     this.cart.CartUpdate(this.cart.itemsOrder);
//   }
//   RemoveItem(item,kitchenid){

    
//     this.cart.RemoveItem(item,kitchenid);
//     this.cart.CartUpdate(this.cart.itemsOrder);
//   }
}
