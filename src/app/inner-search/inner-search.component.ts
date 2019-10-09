import { Component, OnInit } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { KitchenService } from 'src/Services/kitchen.service';
import { GlobalService } from '../../Services/global.service'
import { Router } from '@angular/router';
import {ResturantService } from '../../Services/resturant.service'
// import * as  Sliders from '../../assets/js/script.js';
declare var functionality: any;
@Component({
  selector: 'app-inner-search',
  templateUrl: './inner-search.component.html',
  styleUrls: ['./inner-search.component.css']
})
export class InnerSearchComponent implements OnInit {
  public geoCoder;
  validation:boolean;
  resturants : any;
  address:String;
  city:String;
  country:string;
  totalResturants:number;
  cuisines:any;
  preloader:boolean;
  totalpages;
  CurrentPage;
  pageArray;
  constructor(private global:GlobalService,private kitchenFilter: KitchenService, private mapsAPILoader: MapsAPILoader,public router: Router,private resturantService:ResturantService) { }

  async ngOnInit() {
    
    this.global.header = 3;
    this.preloader = true;
    this.validation = false;
  
    if(this.kitchenFilter.filterKitchen.cousine === undefined){
      this.kitchenFilter.filterKitchen.cousine = new Array<string>();
      
    }
    this.Cuisines();
    if (this.kitchenFilter.GetKitchen().country == undefined || this.kitchenFilter.GetKitchen().country == null) {
      await this.mapsAPILoader.load();
      this.geoCoder = new google.maps.Geocoder;
      await this.setCurrentLocation();
   
     
      this.Search();
    }else{
      this.Search();
    }
    this.city = this.kitchenFilter.filterKitchen.city;
    this.address= this.kitchenFilter.address;
    this.country = this.kitchenFilter.filterKitchen.country.toUpperCase();
    this.kitchenFilter.setfilterKitchen();
  }
  Cuisines(){
    this.kitchenFilter.Cuisines().subscribe((data:any)=>{
      this.cuisines = data.message;
   
    },(error)=>{
      console.log(error);
    })
  }
  addCuisine(value:string){
    this.kitchenFilter.filterKitchen.cousine = new Array<string>();
    this.kitchenFilter.filterKitchen.cousine.push(value);
    this.Search();
    this.kitchenFilter.setfilterKitchen();
  
  }

   Search() {
     this.preloader = true;
    this.kitchenFilter.Kitchenfilter(this.kitchenFilter.filterKitchen).subscribe((data: any) => {
  
      this.resturants = data.message;
      this.totalResturants= this.resturants.length;
      console.log(data.message);
      if(data.message.length == 0){
    
        this.validation = true;
      }else{
        this.validation = false;
      }
      this.totalpages = this.totalResturants % 5;
      if(this.totalResturants % 5 != 0){
        this.totalpages++;
      }
      this.CurrentPage = 1;
      for(let i=0; i< this.totalResturants;i++){
console.log(this.getResturantRating(this.resturants[i]._id));
       this.resturants[i].rating =  this.getResturantRating(this.resturants[i]._id);
       this.resturants[i].review = this.getResturantReviews(this.resturants[i]._id);
       this.resturants[i].page = (Math.floor((i+1)/5))+1;
       console.log((Math.floor((i+1)/5))+1);
      }
      this.pageArray = new Array();
      for(let i = 1; i < this.totalpages;i++){
        this.pageArray.push(i);
      }
      this.preloader = false;

      
      
    }, (error) => {
      console.log(error,"this error");
    })
  
  }
  Next(){
    if((this.CurrentPage+1) > this.totalpages){
      return;
    }else{
      this.CurrentPage +=1;
    }
  }
  Pre(){
    if((this.CurrentPage-1) < 1){
      return;
    }else{
      this.CurrentPage -=1;
    }
  }
  SetPage(num){
    this.CurrentPage =num;
  }
  private async setCurrentLocation(): Promise<any> {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.kitchenFilter.filterKitchen.range = 0;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          self.kitchenFilter.filterKitchen.lat = position.coords.latitude.toString();
          self.kitchenFilter.filterKitchen.lng = position.coords.longitude.toString();
        
          await self.setAddress(Number(self.kitchenFilter.filterKitchen.lat), Number(self.kitchenFilter.filterKitchen.lng));
          self.kitchenFilter.setfilterKitchen();
          resolve(true);
        });
      }else{
        reject("");
      }
    })
  }
  async setAddress(latitude, longitude) {
    let self = this;
    return new Promise((resolve,reject) =>{
      self.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {


        if (status === 'OK') {
          let isCity = false;
          for(let i = 0 ; i < results.length && isCity == false;i++){
            let routes = results[i].types;
            for(let j = 0 ; j < routes.length && isCity == false;j++){
              let types = routes[j];
              if(types == 'locality'){
                self.kitchenFilter.filterKitchen.city =results[i].address_components[0].short_name.toLowerCase();
                isCity = true;
              }
            }
          }
        
          self.kitchenFilter.filterKitchen.country = results[results.length - 1].formatted_address.toLowerCase();
      
          if (results[0]) {
            self.kitchenFilter.address = results[0].formatted_address;
        
          }
          this.kitchenFilter.setfilterKitchen();
          return resolve(true);
        }
        reject(status);
        
      });
    });
  }
  RequestOrder(resturantid:string){
    this.resturantService.Resturantid = resturantid;
    this.resturantService.setResturantid();
  }
  getResturantRating(id){
    let avgrating = 0;
    this.resturantService.resturantRating(id).subscribe((data:any)=>{
      if(data.message.pack[0] != undefined){

        avgrating= data.message.pack[0].average;
      }
    },(error)=>{
      console.log(error)
    })
    return avgrating;
}
getResturantReviews(id){
  let review;
  this.resturantService.resturantReviews(id).subscribe((data:any)=>{
    review = data.message;
  
    
    
  },(error)=>{
    console.log(error)
  })
  return; review.review.length
}
}
