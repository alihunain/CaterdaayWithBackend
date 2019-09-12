import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders} from '@angular/common/http'
import {throwError} from 'rxjs';
import {catchError } from 'rxjs/operators';
import { Contact } from '../app/Models/ContactUs'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  serverUrl = 'http://localhost:4034/';
  httpOptions = {
    header:new HttpHeaders({'Content-Type':'application/json'})
  }

  constructor(private http:HttpClient) { 

  }
  ContactPost(contact:Contact){
    return this.http.post(this.serverUrl + "contactus",contact).pipe(
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
