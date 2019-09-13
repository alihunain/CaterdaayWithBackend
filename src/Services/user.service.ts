import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { GlobalService } from '../Services/global.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:any = null;



  httpOptions = {
    header:new HttpHeaders({'Content-Type':'application/json'})
  }
  constructor(private http:HttpClient,public server: GlobalService) { }
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
  setUser(data){
    this.user = data;
    localStorage.setItem("User",data);

  }
  getUser(){
    if(this.user != null){
      return this.user;
    }else if(typeof (localStorage.getItem("User"))!=undefined){
      this.user = localStorage.getItem("User");
      return this.user;
    }else{
      return null;
    }
  }
  removeUser(){
    this.user = null;
    localStorage.removeItem("User");
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
