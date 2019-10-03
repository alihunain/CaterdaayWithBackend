import { Component, OnInit,ElementRef } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
import { KitchenService } from '../../Services/kitchen.service'
import {CartService} from '../../Services/cart.service'
import { Router } from '@angular/router';
import { ResturantService } from '../../Services/resturant.service'
import { ToastrService } from 'ngx-toastr'
import { Promise, reject } from 'q';
import { UserService } from '../../Services/user.service'
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { promise } from 'protractor';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private user:UserService, private eleRef:ElementRef,private toastr:ToastrService,private resturant:ResturantService,private router: Router,private cart:CartService,private global:GlobalService,private kitchen:KitchenService) { }
  orders:any;
  delivery:any;
  taxpercentage:any;
  currentUserId:any;
  coupon:any;
  currentUserObj:any;
  ngOnInit() {
  
    this.global.header = 3;
    this.currentUserId ="5d8caeb843e7df31d8330208";
    this.orders = this.cart.itemsOrder;
 
    if(this.orders == null){
      this.router.navigate(['/listing']);
    }
    this.cart.checkCart.subscribe(res =>{
      this.orders = res;
     
    });
    let that = this;
    this.getUser();
  this.getDeliveryCharges().then(()=>{
   
    this.getTaxResturant(this.resturant.Resturantid).then((res)=>{
      
      that.orders.delivery = that.delivery;
      that.orders.taxpercentage = that.taxpercentage;
      console.log(that.taxpercentage,"tax percentage");
      that.orders.taxAmount =((that.orders.total/100)*that.taxpercentage);
      that.orders.totalqty = that.cart.cartCount; 
      console.log(that.orders,"order in checkout");
    });
  });
  
  }
  getDeliveryCharges(){
    return Promise((resolve, reject) => {
    this.kitchen.getDeliveryCharges().subscribe((data:any)=>{
      this.delivery = data.message[0].mealpackagecharge;
      resolve(true);
    },(error)=>{
      console.log(error);
      reject(false);
    })
  });
  }
   getTaxResturant(id){
    return Promise((resolve, reject) => {
      this.resturant.resturantsDetails(id).subscribe((data:any)=>{
        console.log(data);
        this.taxpercentage = data.message.tax.value;
        console.log(this.taxpercentage);
        console.log(data.message.tax.value);
        resolve(true);
      },(error)=>{
        console.log(error);
        reject(false);
      })
    });
   

  }
  EditOrder(id){
    this.resturant.Resturantid = id;
  }
  Reedem(){
  
   let coup = this.eleRef.nativeElement.querySelector('#coupon').value;
   if(coup==""){
     return;
   }
    let voucher={
      couponcode:coup,
      kitchenId:this.resturant.Resturantid
    }
    this.kitchen.Coupon(voucher).subscribe((data:any)=>{
      if(data.error){
        this.toastr.error(data.message);
      }else{
        this.coupon = voucher.couponcode;
        this.toastr.success("Coupon Offer Redeem Sucessfully");
      }
    })
  }
  RemoveItem(item){
this.cart.RemoveCombo(item).then(()=>{
  if(this.cart.itemsOrder == null || this.cart.itemsOrder == undefined){
    this.toastr.warning("Your Cart is empty select item you want to order")
    this.router.navigate(['/detail']);
  }
})
  }
  getUser(){
    this.user.getCustomer(this.currentUserId).subscribe((data:any)=>{
      this.currentUserObj = data.message;
      console.log(this.currentUserObj);
    },(error)=>{
      console.log(error);
    })
  }
  PlaceOrder(){
    let order = {
      currency:"CAD",
      customerid:this.currentUserId,
      deliveryCharges:this.orders.delivery,
      addOnitem:[],
      addOnTotal:[],
      Combo:this.orders.items,
      coupon:this.coupon,
      delvierySlot:{},
      delvierySlotsWeek:{},
      discount:0,
      fulladdress:this.currentUserObj.customeraddresses[0],
      items:[],
      mealpackageDeliveryType:false,
      name:this.currentUserObj.name,
      note:"",
      ordertiming:{ //Dynamic Object
        type:"later",
        datetime:Date.now(),
      },
      ordertype:"",
      package:[],
      paymenttype:"cash", //Dynamic Hoga
      restaurantid:this.resturant.Resturantid,
      subtax:0,
      subtotal:0,
      tax: this.orders.taxAmount,
      timezone:"America/Los_Angeles",
      total:this.orders.total
    }
    let orderEmail = {
      customeremail:this.currentUserObj.email,
      order:order,
      restaurantid:this.resturant.Resturantid
    }
    this.Order(order).then((res)=>{
      if(res){
      this.kitchen.OrderEmail(orderEmail).subscribe((data:any)=>{
        this.router.navigate(['/profile']);
        console.log(data,"response of order email");
      },(error)=>{
        this.router.navigate(['/profile']);
        console.log(error,"eror in order email");
      })
    }
    })
  }
  Order(order){
    return Promise((resolve,reject)=>{
    this.kitchen.Order(order).subscribe((data:any)=>{
      console.log(data,"response of order");
      if(!data.error){
        this.toastr.success('Your Order has been placed');

        resolve(true);
      }else{
        this.toastr.error(data.message);
        reject(false);
      }
      },(error)=>{
        this.toastr.error(error)
        reject(false);
      })
    });
  }
  
}
