import { Injectable } from '@angular/core';
import { Kitchen } from 'src/app/Models/Kitchen';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { GlobalService } from '../Services/global.service';
@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  filterKitchen = new Kitchen();
  Kitchenfilter(kitchen:Kitchen){
    return this.http.post(this.server.development.ms1 + "kitchenfilters",kitchen).pipe(
    catchError(this.handleError))
  }
  constructor(private http:HttpClient,public server: GlobalService) { }
  private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.log(`An error occured: ${error.error.message}`);
    }else{
      console.log(`Backend Error : ${error.status} and message is ${error.message}`);
    }
    return throwError("Something Went Wrong");
  }
    SetKitchen(data){
  this.filterKitchen = data;
  }
   GetKitchen(){
    return this.filterKitchen;
  }
}
