import { Component, OnInit,ElementRef } from '@angular/core';
import { GlobalService } from '../../Services/global.service'
import { KitchenService } from '../../Services/kitchen.service'
import {CartService} from '../../Services/cart.service'
import { Router } from '@angular/router';
import { ResturantService } from '../../Services/resturant.service'
import { ToastrService } from 'ngx-toastr'
import { Promise, reject } from 'q';
import { UserService } from '../../Services/user.service'
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private fb:FormBuilder,private user:UserService, private eleRef:ElementRef,private toastr:ToastrService,private resturant:ResturantService,private router: Router,private cart:CartService,private global:GlobalService,private kitchen:KitchenService) { }
  orders:any;
  delivery:any;
  taxpercentage:any;
  currentUserId:any;
  coupon:any;
  currentUserObj:any;
  dateValidation:boolean= false;
  deliveryAddress = this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    phone:['',[Validators.required]]
  })
  deliveryTime =this.fb.group({
    date:['',[Validators.required]],
    time:['',[Validators.required]]
  })
  ngOnInit() {
    this.resturant.getResturantid();
    this.user.getUser();
    this.cart.getItemOrder();
    this.cart.getCurrentResturant();
    this.cart.getCartCount();
    this.user.getUser();
    console.log(this.user.user,"User On Init");
    if(this.user.user == null || this.user.user == undefined){
     this.router.navigate(['/detail']);
   }
    this.global.header = 3;
    this.currentUserId =this.user.user._id;
    this.orders = this.cart.itemsOrder;

    console.log(this.orders)
    if(this.orders == null || this.orders == undefined){
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
      that.orders.totalqty = that.cart.getCartCount(); 
      console.log(that.orders,"order in checkout");
    });
  });
  
  }
  getDeliveryCharges(){
    return Promise((resolve, reject) => {
    this.kitchen.getDeliveryCharges().subscribe((data:any)=>{
      console.log(data);
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
  if(this.cart.getItemOrder() == null || this.cart.getItemOrder() == undefined){
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
    let deliverytype =   this.eleRef.nativeElement.querySelector('input[name="delivery-method"]:checked').value;
    let payment = this.eleRef.nativeElement.querySelector('input[name="pay-meth"]:checked').value;
    if(payment == "Cash"){
      let order = {
        currency:"CAD", //User selected country currency
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
        ordertiming:{
          type:"later",
          datetime:this.deliveryTime.get('date') + " " + this.deliveryTime.get('time'),
        },
        ordertype:"",
        package:[],
        paymenttype: payment, 
        restaurantid:this.resturant.Resturantid,
        subtax:this.orders.taxAmount,
        subtotal:this.orders.total,
        tax: this.orders.taxAmount,
        timezone:"America/Los_Angeles", //User selected country flow
        total:this.orders.total+this.orders.taxAmount+this.orders.delivery
      }
      let orderEmail = {
        customeremail:this.currentUserObj.email,
        order:order,
        restaurantid:this.resturant.Resturantid
      }
      this.Order(order).then((res)=>{
        if(res){
    
        this.kitchen.OrderEmail(orderEmail).subscribe((data:any)=>{
          console.log(data,"response of order email");
          this.router.navigate(['/thankyou']);
          
        },(error)=>{
          console.log(error,"error in order email");
        })
      }
      })
    }else{
      alert("Working On Card");
    }
    
 
    
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
  get name(){
    return this.deliveryAddress.get('name');
  }
  get email(){
    return this.deliveryAddress.get('email');
  }
  get phone(){
    return this.deliveryAddress.get('phone');
  }
  get date(){
    this.dateValid();
    return this.deliveryTime.get('date');
  }
  get time(){
    return this.deliveryTime.get('time');
  }
  dateValid(){
    let date = new Date(this.deliveryTime.get('date').value);
    let today = new Date();
    if(date > today){
      this.dateValidation = true;
    }else{
      this.dateValidation = false;
    }
  }
  
}
