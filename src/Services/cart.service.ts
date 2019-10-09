import { Injectable } from '@angular/core';
import { Order } from '../app/Models/Order'
import { Subject } from 'rxjs';
import { UserService } from '../Services/user.service'
import { KitchenService } from './kitchen.service'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartCount: number = 0;
  public itemsOrder: any;
  private cartupdate = new Subject<any>();
  public currentResturant = null;
  checkCart = this.cartupdate.asObservable();
  constructor(private kitchen : KitchenService,private user: UserService,private toastr:ToastrService) { }
  CartUpdate(update: any) {
    this.cartupdate.next(update);
    console.log("Cart Updated");
  }
  addBufferItem(item, quantity, kitchenName) {
    console.log('i am hit')
    if (this.itemsOrder === undefined) {
      this.itemsOrder = new Object();
      this.itemsOrder.items = new Array<Order>();
      this.itemsOrder.kitchenName = kitchenName;
      this.itemsOrder.totalqty = 0;
    }
    let index = this.isBufferExist(item.name);
    if (index != -1) {
      console.log(this.itemsOrder.items[index], "Current test module");
      this.itemsOrder.items[index].qty = Number(this.itemsOrder.items[index].qty) + Number(quantity);
      this.itemsOrder.items[index].totalprice += (quantity * item.finalcomboprice);
      this.itemsOrder.total += (quantity * item.finalcomboprice);
    } else {
      item.qty = quantity;
      item.totalprice = quantity * item.finalcomboprice;
      item.totaldiscount = item.discount * quantity;
      if (this.itemsOrder.total === undefined) {
        this.itemsOrder.total = (quantity * item.finalcomboprice);
      } else {
        this.itemsOrder.total += (quantity * item.finalcomboprice);
      }
      this.itemsOrder.items.push(item);
    }
    this.setCartCount();
    this.setItemOrder();
    this.CartUpdate(this.getItemOrder());
    this.toastr.success("Item Added")

  }

  isBufferExist(name) {
    if(this.itemsOrder === undefined || this.itemsOrder == null){
      return -1;
    }
    for (let i = 0; i < this.itemsOrder.items.length; i++) {
      if (this.itemsOrder.items[i].name == name) {
        return i;
      }
    }
    return -1;
  }
  RemoveCombo(item) {
    console.log(item);
    return new Promise((resolve,reject)=>{
    let items = this.itemsOrder.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].name == item.name) {
        this.itemsOrder.total -= this.itemsOrder.items[i].totalprice;
        this.cartCount -= this.itemsOrder.items[i].qty;
        this.itemsOrder.items.splice(i, 1);
        console.log("spliced");
        console.log(this.itemsOrder.items.length);
      }
    }
    
    if (this.itemsOrder.items.length == 0) {
    
     this.removeItemOrders();
      this.cartCount = 0;

      this.currentResturant = null;
      this.setcurrentResturant();
  
    }
    this.setCartCount();
    console.log(typeof this.itemsOrder);
    this.setItemOrder();
    this.CartUpdate(this.getItemOrder());
    resolve();
  })
  }

  removeItemOrders(){
    localStorage.removeItem("itemsOrder");
    this.itemsOrder = undefined;
  }
  //Return CartCount Service With LocalStorage
  getCartCount(){
    if(this.cartCount == undefined || this.cartCount == null){
      if(localStorage.getItem("cartCount") == null || localStorage.getItem("cartCount") == undefined){
        return null;
      }else{
        this.cartCount = JSON.parse(localStorage.getItem("cartCount"));
        return JSON.parse(localStorage.getItem("cartCount"));
      }
    }else{
      return this.cartCount;
    }
  }
  //Set CartCount Service With LocalStorage
  setCartCount(){
    localStorage.setItem("cartCount",JSON.stringify(this.cartCount));
  }
  getCurrentResturant(){
    if(this.currentResturant == undefined || this.currentResturant == null){
      if(localStorage.getItem("currentResturant") == null || localStorage.getItem("currentResturant") == undefined){
        return null;
      }else{
        this.currentResturant = JSON.parse(localStorage.getItem("currentResturant"));
        return JSON.parse(localStorage.getItem("currentResturant"));
      }
    }else{
      return this.currentResturant;
    }
  }
  setcurrentResturant(){
    localStorage.setItem("currentResturant",JSON.stringify(this.currentResturant));
  }
  setItemOrder(){
    if(this.itemsOrder == undefined){
      localStorage.removeItem("itemsOrder");
      return;
    }
    localStorage.setItem("itemsOrder",JSON.stringify(this.itemsOrder));
  }
  getItemOrder(){
    if(this.itemsOrder == undefined || this.itemsOrder == null){
      console.log(typeof localStorage.getItem('itemsOrder'));
      console.log(localStorage.getItem("itemsOrder") == undefined,"istrue?")
      console.log(localStorage.getItem("itemsOrder"),"data")
      if(localStorage.getItem("itemsOrder") == null || localStorage.getItem("itemsOrder") ==  undefined ){
        
        console.log("not returning item orders from local storage")
        return null;
      }else{
        console.log("returning item orders from local storage")
        this.itemsOrder = JSON.parse(localStorage.getItem("itemsOrder"));
        return JSON.parse(localStorage.getItem("itemsOrder"));
      }
    }else{
      return this.itemsOrder;
    }
  }




















  // PlusItem(item, resturantname) {
  //   if (this.itemsOrder === undefined) {
  //     this.itemsOrder = new Array<Order>();
  //   }
  //   let index = this.isKitchenExist(item.kitchenId);
  //   if (index == -1) {
  //     let orderObj = new Order();
  //     orderObj.resturantid = item.kitchenId;
  //     orderObj.total = item.price;
  //     orderObj.name = resturantname;
  //     orderObj.items = new Array<any>();
  //     item.qty = 1;
  //     orderObj.currency = 'CAD';
  //     orderObj.items.push(item);
  //     let user = this.user.getUser();
  //     if (user.data != undefined) {
  //       orderObj.customerid = user.data._id;
  //     }
  //     this.itemsOrder.push(orderObj)
  //   } else {
  //     let itemIndex = this.isItemExist(item._id, this.itemsOrder[index].items);
  //     this.itemsOrder[index].total += item.price;
  //     if (itemIndex == -1) {

  //       item.qty = 1;

  //       this.itemsOrder[index].items.push(item);
  //     } else {

  //       console.log("item exist");
  //       ++item.qty;
  //     }
  //   };
  //   console.log(this.itemsOrder);


  // }
  // RemoveItem(item, kitchenID) {
  //   let indexResturant = this.isKitchenExist(kitchenID);
  //   let indexItem = this.isItemExist(item._id, this.itemsOrder[indexResturant].items);
  //   this.itemsOrder[indexResturant].total -= this.itemsOrder[indexResturant].items[indexItem].price * this.itemsOrder[indexResturant].items[indexItem].qty;

  //   this.itemsOrder[indexResturant].items.splice(indexItem, 1);
  //   if (this.itemsOrder[indexResturant].items.length === 0) {
  //     this.itemsOrder.splice(indexResturant, 1);
  //   }
  // }
  // MinusItem(item) {
  //   console.log(item);

  //   let kitchenID = item.kitchenId;

  //   let indexResturant = this.isKitchenExist(kitchenID);
  //   if (indexResturant != -1) {
  //     let indexItem = this.isItemExist(item._id, this.itemsOrder[indexResturant].items);
  //     if (indexItem != -1) {
  //       this.itemsOrder[indexResturant].items[indexItem].qty--;
  //       this.itemsOrder[indexResturant].total -= item.price;
  //       if (this.itemsOrder[indexResturant].items[indexItem].qty == 0) {
  //         this.itemsOrder[indexResturant].items.splice(indexItem, 1);
  //         if (this.itemsOrder[indexResturant].items.length === 0) {
  //           this.itemsOrder.splice(indexResturant, 1);
  //           console.log(this.itemsOrder);
  //         }
  //       }
  //     }
  //   } else {

  //     return;
  //   }

  // }
  // isKitchenExist(kitchenid) {
  //   var kitchens = this.itemsOrder;
  //   for (let i = 0; i < kitchens.length; i++) {
  //     if (kitchens[i].resturantid == kitchenid) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }
  // isItemExist(itemId, itemarray) {


  //   for (let i = 0; i < itemarray.length; i++) {
  //     console.log(itemId, "to search");
  //     console.log(itemarray[i]._id);
  //     if (itemarray[i]._id == itemId) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }
}
