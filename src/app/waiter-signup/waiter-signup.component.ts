import { Component, OnInit,ElementRef,NgZone,ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from '../../Services/global.service'
import {DriverService} from '../../Services/driver.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-waiter-signup',
  templateUrl: './waiter-signup.component.html',
  styleUrls: ['./waiter-signup.component.css']
})
export class WaiterSignupComponent implements OnInit {
  private geoCoder;
  Waiter = this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.email,Validators.required]],
    phone:['',[Validators.required]],
    identity:['',[Validators.required]],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    state:['',[Validators.required]],
    yourself:['',[Validators.required,Validators.minLength(100)]],
    password:['',[Validators.required]]
  })
  emailvalid = false;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(private toastr:ToastrService,private mapsAPILoader: MapsAPILoader,private router:Router,private ngZone: NgZone, private global:GlobalService,private fb:FormBuilder,private driverService:DriverService) { }

  ngOnInit() {
    this.global.header = 2;
    this.mapsAPILoader.load().then(() => {
    this.geoCoder = new google.maps.Geocoder;
    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ["address"]
    });
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // console.log(place.geometry);
        //set latitude, longitude and zoom
        // this.kitchenservice.filterKitchen.lat = place.geometry.location.lat().toString();
        // this.kitchenservice.filterKitchen.lng = place.geometry.location.lng().toString();
      
        this.getAddress(Number(place.geometry.location.lat()),Number(place.geometry.location.lng()));
      })
      });
    });
  }
  getAddress(latitude, longitude) {
    return new Promise((resolve,reject)=>{
   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
     if (status === 'OK') {
       let isCity = false;
     
       for(let i = 0 ; i < results.length && isCity == false;i++){
         let routes = results[i].types;
         for(let j = 0 ; j < routes.length;j++){
           let types = routes[j];
      
           if(types == 'locality'){
             this.Waiter.controls['city'].setValue(results[i].address_components[0].short_name);
             isCity = true;
             break;
           }
         }
       }
     
      //  this.kitchenservice.filterKitchen.country = results[results.length-1].formatted_address.toLowerCase();
  
      //  if (results[0]) {
      //    this.searchElementRef.nativeElement.value = results[0].formatted_address;
      //    this.kitchenservice.address = results[0].formatted_address;
      //    this.update = results[0].formatted_address
      //  }
      //  this.kitchenservice.setfilterKitchen();
       resolve(true);
     }

   });
 });
 }
  get name(){
    return this.Waiter.get('name');
  }

  get email(){
    return this.Waiter.get('email');
  }
  get phone(){
    return this.Waiter.get('phone');
  }

  get identity(){
    return this.Waiter.get('identity');
  }
  get address(){
    return this.Waiter.get('address');
  }
  get city(){
    return this.Waiter.get('city');
  }
  get state(){
    return this.Waiter.get('state');
  }
  get yourself(){
    return this.Waiter.get('yourself');
  }
  get password(){
    return this.Waiter.get('password');
  }
  waiterSignup(){
   this.driverService.WaiterSignup(this.Waiter.value).subscribe((data:any)=>{
     if(!data.error){
       this.toastr.success('your form has been submit');
       this.router.navigate(['/'])
     }
   })
  }
}
