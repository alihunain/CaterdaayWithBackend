import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError, Subject} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { GlobalService } from '../Services/global.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:any = null;
  private login = new Subject<any>();
  checkCurrentUser = this.login.asObservable();
  private LoginElement = new Subject<any>();
  getLoginElement = this.LoginElement.asObservable();


  httpOptions = {
    header:new HttpHeaders({'Content-Type':'application/json'})
  }
  constructor(private http:HttpClient,public server: GlobalService) { }
  UpdateLoginElement(ele){

     this.LoginElement.next(ele);
   }
  UserUpdate(mission: boolean) {
    this.login.next(mission);
  }
  forgetPassword(email:any){
    return this.http.post(   this.server.development.ms3 + "customers/forget-password",email).pipe(
      catchError(this.handleError))
  }
  Login(user:any){
    return this.http.post(   this.server.development.ms3 + "customers/login",user).pipe(
    catchError(this.handleError))
  }
  Signup(user:any){
    return this.http.post(this.server.development.ms3 + "customers/signup",user).pipe(
    catchError(this.handleError))
  }
  GetCountryList(){
    return this.http.get(this.server.development.ms6 + "countrylist").pipe(
      catchError(this.handleError))
  }
  verfityCard(cardDetails:any){
    return this.http.post(this.server.development.ms4+"verify-card",cardDetails).pipe(catchError(this.handleError));
  }
  getCustomerRating(userid:any){
    return this.http.get(this.server.development.ms4 + "rating/customer-rating/" + userid).pipe(catchError(this.handleError));
  }
  getUserOrder(userid:any){
    return this.http.get(this.server.development.ms4 + "customerorder/" + userid).pipe(catchError(this.handleError));
  }
  AddSubscriber(email:any){
    return this.http.post(this.server.development.ms1 +  "subscriber",email).pipe(catchError(this.handleError))
  }
  addCustomerAdress(userid:any,address:any){
    return this.http.post(this.server.development.ms3 + "customer-address/" + userid,address).pipe(catchError(this.handleError));
  }
  getAllCustomer(){
    return this.http.get(this.server.development.ms3+ "customers" ).pipe(catchError(this.handleError));
  }
  deleteCustomerAdress(userid:any,request){
    return this.http.put(this.server.development.ms3+"customer-address/" + userid,request ).pipe(catchError(this.handleError));
  }
  UpdateProfile(userid,profile:any){
return this.http.put(this.server.development.ms3 + "customers/" + userid,profile).pipe(catchError(this.handleError));
  }
  getCustomer(userid:any){
    return this.http.get(this.server.development.ms3 + "customers/" + userid).pipe(catchError(this.handleError));
  }
  changePassword(userid,credentials){
return this.http.put(this.server.development.ms3+"customers/change-password/" +  userid,credentials).pipe(catchError(this.handleError));
  }
  generateToken(credentials){
    return this.http.post(this.server.development.ms4+"generate-card-token",credentials).pipe(catchError(this.handleError));
  }
  setUser(){
    localStorage.setItem("user",JSON.stringify(this.user));
  }
  getUser(){
    if(this.user == undefined || this.user == null){
      if(localStorage.getItem("user") == null || localStorage.getItem("user") == undefined){
        return null;
      }else{
        this.user = JSON.parse(localStorage.getItem("user"));
        return JSON.parse(localStorage.getItem("user"));
      }
    }else{
      return this.user;
    }
  }
  removeUser(){
    this.user = null;
    localStorage.removeItem("user");
  }
  private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.log(`An error occured: ${error.error.message}`);
    }else{
      console.log(`Backend Error : ${error.status} and message is ${error.message}`);
    }
    return throwError("Something Went Wrong");
  }
}
