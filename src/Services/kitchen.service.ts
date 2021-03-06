import { Injectable } from '@angular/core';
import { Kitchen } from 'src/app/Models/Kitchen';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalService } from '../Services/global.service';
@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  address: any;
  resturants:any;
  filterKitchen: Kitchen = new Kitchen();
  allKitchen(){
    return this.http.get(this.server.development.ms1 +"kitchen").pipe(catchError(this.handleError));
  }
  Kitchenfilter(data: any) {
    
    return this.http.post(this.server.development.ms1 + "kitchenfilters", data).pipe(
      catchError(this.handleError))
  }
  Cuisines(){
    return this.http.get(this.server.development.ms6 + "cuisines").pipe(
      catchError(this.handleError));
  }
  constructor(private http: HttpClient, public server: GlobalService) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occured: ${error.error.message}`);
    } else {
      console.log(`Backend Error : ${error.status} and message is ${error.message}`);
    }
    return throwError("Something Went Wrong");
  }
  SetKitchen(data) {
    this.filterKitchen = data;
    this.setfilterKitchen();
  }
  getDeliveryCharges(){
    return this.http.get(this.server.development.ms6 + "deliverycharges").pipe(catchError(this.handleError));
  }
  GetKitchen() {
    return this.filterKitchen;
  }
  Coupon(voucher){
    return this.http.post(this.server.development.ms2 + "offer/redeem",voucher).pipe(catchError(this.handleError));
  }
  Order(order){
    return this.http.post(this.server.development.ms4 + "order",order).pipe(catchError(this.handleError));
  }
  OrderEmail(order){
    return this.http.post(this.server.development.ms1+"order-email",order).pipe(catchError(this.handleError));
  }
  // OfferList(data){
  //   return this.http.get(this.server.development.ms2+"offerlist",data).pipe(
  //     catchError(this.handleError)
  //   )
  // }
  // FavouriteItemList(data){
  //   return this.http.get(this.server.development.ms3 + "favouriteitem-list",data).pipe(
  //     catchError(this.handleError)
  //   )
  // }
  // FavouriteList(data){
  //   return this.http.get(this.server.development.ms3 + "favouriteitem-list",data).pipe(
  //     catchError(this.handleError)
  //   )
  // }
  getAddress(){
    if(this.address == undefined || this.address == null){
      if(localStorage.getItem("address") == null || localStorage.getItem("address") == undefined){
        return null;
      }else{
        this.address = JSON.parse(localStorage.getItem("address"));
        return JSON.parse(localStorage.getItem("address"));
      }
    }else{
      return this.address;
    }
  }
  setaddress(){
    localStorage.setItem("address",JSON.stringify(this.address));
  }
  // setCartCount(){
  //   localStorage.setItem("address",JSON.stringify(this.address));
  // }
  setresturants(){
    localStorage.setItem("resturants",JSON.stringify(this.resturants));
  }
  
  getresturant(){
    if(this.resturants == undefined || this.resturants == null){
      if(localStorage.getItem("resturants") == null || localStorage.getItem("resturants") == undefined){
        return null;
      }else{
        this.resturants = JSON.parse(localStorage.getItem("resturants"));
        return JSON.parse(localStorage.getItem("resturants"));
      }
    }else{
      return this.resturants;
    }
  }
  getfilterKitchen(){
    return new Promise((resolve,reject)=>{
      let k = new Kitchen();
      k = JSON.parse(localStorage.getItem("filterKitchen"));
  
      
      
      if(localStorage.getItem("filterKitchen") == undefined){
        return resolve(this.filterKitchen);
      }
      else{
        k.cousine = new Array<string>();
        this.filterKitchen = JSON.parse(localStorage.getItem("filterKitchen"));
        this.filterKitchen.cousine = new Array<string>();
        this.setfilterKitchen();
      }
     
    
      
      return resolve(this.filterKitchen);
    
   
    if(this.filterKitchen == new Kitchen() || this.filterKitchen == null){
    
      if(localStorage.getItem("filterKitchen") == null || localStorage.getItem("filterKitchen") == undefined){
   
        return resolve(null);
      }else{
        this.filterKitchen = JSON.parse(localStorage.getItem("filterKitchen"));
   
        return resolve(JSON.parse(localStorage.getItem("filterKitchen")));
      }
    }else{
      return resolve(this.filterKitchen);
    }
  });
  }
  setfilterKitchen(){
    localStorage.setItem("filterKitchen",JSON.stringify(this.filterKitchen));
  }
}
