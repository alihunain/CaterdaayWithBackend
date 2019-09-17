import { Component, OnInit } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { KitchenService } from 'src/Services/kitchen.service';
import { async } from 'q';
// import * as  Sliders from '../../assets/js/script.js';
declare var functionality: any;
@Component({
  selector: 'app-inner-search',
  templateUrl: './inner-search.component.html',
  styleUrls: ['./inner-search.component.css']
})
export class InnerSearchComponent implements OnInit {
  private geoCoder;
  constructor(private kitchenFilter:KitchenService,private mapsAPILoader: MapsAPILoader) { }

   async ngOnInit() {
    if(this.kitchenFilter.GetKitchen().country == undefined || this.kitchenFilter.GetKitchen().country == null ){
      await this.mapsAPILoader.load();
        await this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;
        console.log("running")
    }else{
      this.Search();
    }
    
  }
  Search(){
    console.log(this.kitchenFilter.filterKitchen);
this.kitchenFilter.Kitchenfilter(this.kitchenFilter.filterKitchen).subscribe((data:any)=>{
  console.log(data);
},(error)=>{
  console.log(error);
})
  }
  private async setCurrentLocation() {
    this.kitchenFilter.filterKitchen.range = 0;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async(position) => {
        this.kitchenFilter.filterKitchen.lat = position.coords.latitude.toString();
        this.kitchenFilter.filterKitchen.lng = position.coords.longitude.toString();
        console.log(this.kitchenFilter.filterKitchen,"Here");
      await this.getAddress( Number(this.kitchenFilter.filterKitchen.lat),Number(this.kitchenFilter.filterKitchen.lng));
      });
    }
  }
  async getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(status)
      console.log(this.kitchenFilter.filterKitchen,"Here2");
      if (status === 'OK') {
        this.kitchenFilter.filterKitchen.country = results[results.length-1].formatted_address.toLowerCase();
        console.log(this.kitchenFilter.filterKitchen.country)
        if (results[0]) {
          this.kitchenFilter.address = results[0].formatted_address;
        }
      }
      this.Search();
  
    });
  }
}
