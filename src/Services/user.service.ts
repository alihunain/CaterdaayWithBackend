import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { Contact } from '../app/Models/ContactUs';
import {User} from '../app/Models/User'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  serverUrl = 'http://localhost:4034/';
  httpOptions = {
    header:new HttpHeaders({'Content-Type':'application/json'})
  }
  constructor(private http:HttpClient) { }
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
}
