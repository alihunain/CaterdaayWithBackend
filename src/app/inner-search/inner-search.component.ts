import { Component, OnInit } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { KitchenService } from 'src/Services/kitchen.service';
import { async, resolve, reject } from 'q';
import { promise } from 'protractor';
import { resolveCname } from 'dns';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
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
  constructor(private kitchenFilter: KitchenService, private mapsAPILoader: MapsAPILoader,public router: Router) { }

  async ngOnInit() {
    this.preloader = true;
    this.validation = false;
    console.log(this.kitchenFilter.filterKitchen.cousine,"cousine");
    if(this.kitchenFilter.filterKitchen.cousine === undefined){
      this.kitchenFilter.filterKitchen.cousine = new Array<string>();
      console.log(this.kitchenFilter.filterKitchen.cousine)
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
    let selectedAddress =this.kitchenFilter.address.split(',');
    this.city = selectedAddress[selectedAddress.length-4];
    this.address= this.kitchenFilter.address;
    this.country = this.kitchenFilter.filterKitchen.country.toUpperCase();
  }
  Cuisines(){
    this.kitchenFilter.Cuisines().subscribe((data:any)=>{
      this.cuisines = data.message;
      console.log(this.cuisines)
    },(error)=>{
      console.log(error);
    })
  }
  addCuisine(value:string){
    this.kitchenFilter.filterKitchen.cousine = new Array<string>();
    this.kitchenFilter.filterKitchen.cousine.push(value);
    this.Search();
  }
   Search() {
     this.preloader = true;
    this.kitchenFilter.Kitchenfilter(this.kitchenFilter.filterKitchen).subscribe((data: any) => {
      console.log(data);
      this.resturants = data.message;
      this.totalResturants= this.resturants.length;
      if(data.message.length == 0){
    
        this.validation = true;
      }else{
        this.validation = false;
      }
      console.log(this.validation);
      this.preloader = false;
    }, (error) => {
      console.log(error,"this error");
    })
  
  }
  private async setCurrentLocation(): Promise<any> {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.kitchenFilter.filterKitchen.range = 0;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          self.kitchenFilter.filterKitchen.lat = position.coords.latitude.toString();
          self.kitchenFilter.filterKitchen.lng = position.coords.longitude.toString();
          console.log(self.kitchenFilter.filterKitchen, "I am In Current Location");
          await self.setAddress(Number(self.kitchenFilter.filterKitchen.lat), Number(self.kitchenFilter.filterKitchen.lng));
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
        console.log(status)
        console.log(self.kitchenFilter.filterKitchen, "I am in get Address");
        if (status === 'OK') {
          self.kitchenFilter.filterKitchen.country = results[results.length - 1].formatted_address.toLowerCase();
          console.log(self.kitchenFilter.filterKitchen.country)
          if (results[0]) {
            self.kitchenFilter.address = results[0].formatted_address;
            console.log(self.kitchenFilter.address);
          }
          return resolve(true);
        }
        reject(status);
      });
    });
  }
}
