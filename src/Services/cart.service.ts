import { Injectable } from '@angular/core';
import {Order} from '../app/Models/Order'
import {Subject} from 'rxjs';
import {UserService} from '../Services/user.service'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public itemsOrder = new Array<Order>();
  private cartupdate = new Subject<any>();
  checkCart = this.cartupdate.asObservable();
  constructor(private user: UserService) { }
  CartUpdate(update: any) {
    this.cartupdate.next({update});
    console.log("working");
  }
  addOrder(item,resturantname){
    let index = this.isKitchenExist(item.kitchenId);

    console.log(index);
    if(index==-1){
      let orderObj = new Order();
      orderObj.resturantid = item.kitchenId;
      orderObj.total = item.price;
      orderObj.name = resturantname;
      orderObj.items = new Array<any>();
      item.qty = 1;
      orderObj.currency = 'CAD';
      orderObj.items.push(item);
     let user = this.user.getUser();
      if(user.data != undefined){
        orderObj.customerid = user.data._id;
      }
      this.itemsOrder.push(orderObj)
    }else{
       let itemIndex = this.isItemExist(item._id,this.itemsOrder[index].items);
       this.itemsOrder[index].total +=item.price;
       if(itemIndex == -1){
   
        item.qty = 1;

        this.itemsOrder[index].items.push(item);
       }else{
         
        console.log("item exist");
          ++item.qty;
       }
    };
    console.log(this.itemsOrder);

    // if(this.itemsOrder.get(menu.kitchenID) === undefined){
    //   console.log("Kitchen ID is Undefined")
    //   let order = new Order();
    //   this.itemsOrder.set(menu.kitchenID,order);
    //   console.log(this.itemsOrder);
    //   let currentitem = item;
    //   currentitem.qty = 1;
    //   this.itemsOrder.get(menu.kitchenID).items = new Map();
    //   this.itemsOrder.get(menu.kitchenID).items.set(item.itemID , currentitem);
    // }else{
    //   if(this.itemsOrder.get(menu.kitchenID).items.get(item.itemID) == undefined){
    //   let currentitem = item;
    //   currentitem.qty = 1;
    //     this.itemsOrder.get(menu.kitchenID).items.set(item.itemID,currentitem);
    //   }else{
    //     this.itemsOrder.get(menu.kitchenID).items.get(item.itemID).qty++;
    //   }
    // }
    // console.log(this.itemsOrder.get(menu.kitchenID).items.size);
    // console.log(this.itemsOrder);

  }
  removeItem(item){
    console.log(item);

    let kitchenID = item.kitchenId;
 
    let indexResturant = this.isKitchenExist(kitchenID);
    if(indexResturant != -1){
      let indexItem =  this.isItemExist(item._id,this.itemsOrder[indexResturant].items);
      if(indexItem != -1){
        this.itemsOrder[indexResturant].items[indexItem].qty--;
        this.itemsOrder[indexResturant].total-=item.price;
        if(this.itemsOrder[indexResturant].items[indexItem].qty == 0){
          this.itemsOrder[indexResturant].items.splice(indexItem,1);
          if(this.itemsOrder[indexResturant].items.length  === 0){
            this.itemsOrder.splice(indexResturant,1);
            console.log(this.itemsOrder);
          }
        }
      }
    }else{

      return;
    }   

  }
  isKitchenExist(kitchenid){
    var kitchens = this.itemsOrder;
    for(let i = 0;i < kitchens.length;i++){
      if(kitchens[i].resturantid == kitchenid){
        return i;
      }
    }
    return -1;
  }
  isItemExist(itemId,itemarray){
    for(let i = 0; i < itemarray.length;i++){
      console.log(itemId,"to search");
      console.log(itemarray[i].id);
      if(itemarray[i]._id == itemId){
        return i;
      }
    }
    return -1;
  }
}
