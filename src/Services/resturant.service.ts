import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalService } from '../Services/global.service';
@Injectable({
  providedIn: 'root'
})
export class ResturantService {
  public Resturantid:string ="5b8ca7fd4d830e1b62e4bccf";
  constructor(private http: HttpClient, public server: GlobalService) { }
  //this will return resturn reviews
  resturantReviews(resturantid){
return this.http.get(this.server.development.ms4 + "rating/restaurant-rating-review/" +resturantid).pipe(catchError(this.handleError));
  }
   //this will return resturn avg rating
  resturantRating(resturantid){
    return this.http.get(this.server.development.ms4+"rating/restaurant-rating/"+resturantid).pipe(catchError(this.handleError))
  }
  //this will return resturant details
  resturantsDetails(resturantid){
    return this.http.get(this.server.development.ms1+"kitchen/"+resturantid).pipe(catchError(this.handleError))
  }
  //This will give resturant offer lists
  offerList(resturantid){
    return this.http.get(this.server.development.ms2+"offer-list/"+resturantid).pipe(catchError(this.handleError)
    )
  }
  //This Api's Hit only when a user login 
  favouriteItemList(userid){
    return this.http.get(this.server.development.ms3 + "favouriteitem-list/"+userid).pipe(catchError(this.handleError)
    )
  }
    //This Api's Hit only when a user login 
  favouriteList(userid){
    return this.http.get(this.server.development.ms2 + "favourite-list/"+userid).pipe(catchError(this.handleError))
  }
  //This will give resturant active items
  activeItem(resturantid){
    return this.http.get(this.server.development.ms2 + "active-items/"+resturantid).pipe(catchError(this.handleError))
  }
  //This will give is resturant menulist ok ?
  menuList(resturantid){
    return this.http.get(this.server.development.ms2+ "menu-list/"+resturantid).pipe(catchError(this.handleError));
  }
    //this will return active combos of resturant
  activeCombos(resturantid){
    return this.http.get(this.server.development.ms2+ "active-combos/"+resturantid).pipe(catchError(this.handleError));
  }
  //this will return active mealpackages of resturant
  activeMealPackages(resturantid){
    return this.http.get(this.server.development.ms2+ "active-mealpackages/"+resturantid).pipe(catchError(this.handleError));
  }
  customerById(ids){
    return this.http.post(this.server.development.ms3 +"customers/multiple",ids).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occured: ${error.error.message}`);
    } else {
      console.log(`Backend Error : ${error.status} and message is ${error.message}`);
    }
    return throwError("Something Went Wrong");
  }
}