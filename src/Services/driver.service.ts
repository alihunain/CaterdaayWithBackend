import { Injectable } from '@angular/core';
import { Kitchen } from 'src/app/Models/Kitchen';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { GlobalService } from './global.service';
@Injectable({
  providedIn: 'root'
})
export class DriverService {
  httpOptions = {
    header:new HttpHeaders({'Content-Type':'application/json'})
  }
  constructor(private http:HttpClient,public server: GlobalService) { }
  Signup(driver:any){
    return this.http.post(this.server.development.ms1 + "driver",driver).pipe(
    catchError(this.handleError))
  }
  WaiterSignup(data:any){
    return this.http.post(this.server.development.ms1 + "waiter",data  ).pipe(catchError(this.handleError));
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
