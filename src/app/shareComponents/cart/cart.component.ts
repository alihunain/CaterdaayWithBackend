import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {CartService} from '../../../Services/cart.service'
import { UserService } from '../../../Services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public kitchenName = 'Gregory Denton';
  public orders:any;
  @ViewChild('#loginn')
  public login: ElementRef;
  constructor(private router:Router,private userservice:UserService,private cart:CartService,private toastr:ToastrService,private eleRef: ElementRef) { }

  ngOnInit() {
    this.orders = this.cart.getItemOrder();
    this.cart.checkCart.subscribe(res =>{
      this.orders = res;
      // this.orders.total = Math.
    
    });
   
  }
  RemoveCombo(items){
    this.cart.RemoveCombo(items).then(()=>{
      this.toastr.success("Item Remove");
    })
    if(this.cart.cartCount == 0){
      if(this.router.url == "/checkout"){
        this.toastr.warning("Your Cart Is Empty Kindly Fill First");
        this.router.navigate['/details'];
      }else{
        return;
      }
    }
  }

  stopPropagation(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
  proceedToCheckout(){
    let user = this.userservice.getUser();
    if(user == null || user == undefined){
  
      this.userservice.UpdateLoginElement(true);

    }else{
      this.router.navigate(['/checkout']);
    }
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
