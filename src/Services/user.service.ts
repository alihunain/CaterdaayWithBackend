import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { GlobalService } from '../Services/global.service';
import {User} from '../app/Models/User'
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:any = null;
  // User obj: abny ;
  // set user (user){
  //   this.Us = user;
  //   loicauser.set
  // }
  // get User (){
  //   if(timingSafeEqual.user){re}else{longStackSupport.contain(user)
  //   longStackSupport.get(user)= user}
  //   return uer
  // }
  serverUrl = 'http://localhost:4034/';
  httpOptions = {
    header:new HttpHeaders({'Content-Type':'application/json'})
  }
  constructor(private http:HttpClient,public glob: GlobalService) { }
  Login(user:any){
    console.log(user)
    return this.http.post(this.serverUrl + "customers/login",user).pipe(
    catchError(this.handleError))
  }
  Signup(user:any){
    return this.http.post(this.serverUrl + "customers/signup",user).pipe(
    catchError(this.handleError))
  }
  private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.log(`An error occured: ${error.error.message}`);
    }else{
      console.log(`Backend Error : ${error.status} and message is ${error.message}`);
    }
    return throwError("Something Went Wrong");
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
}
