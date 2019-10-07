import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { UserService } from '../../Services/user.service'
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader } from '@agm/core';
import { GlobalService } from '../../Services/global.service'
import { Router } from '@angular/router';
import { KitchenService } from '../../Services/kitchen.service'
import { ResturantService} from '../../Services/resturant.service'
import { map } from 'rxjs/operators';
import { promise } from 'protractor';
import { POINT_CONVERSION_COMPRESSED } from 'constants';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userdata:any;
  items=new Map();
  lng:any;
  lat:any;
  zoom=10;
  checkpassword:boolean=false;
  mapaddress:string;
  favouriteItems:any;
  allKitchens:any;
  customerAddress:any;
  allOrders:any;
  pastOrders:any;
  orderForPopup:any;
  porderForPopup:any;
  Profile = this.fb.group({
    email:['',[Validators.required]],
    lastname:['',[Validators.required]],
    firstname:['',[Validators.required]],
    homephone:['',[Validators.required]],
    dob:['',[Validators.required]],
    cellphone:['',[Validators.required]]
  })
  Card = this.fb.group({
    address: ['',[Validators.required]],
    cardnumber: ['',[Validators.required],[Validators.minLength(15)],[Validators.maxLength(17)]],
    cvv: ['',[Validators.required],[Validators.minLength(2)],[Validators.maxLength(4)]],
    expirymonth: ['',[Validators.required],[Validators.minLength(1)],[Validators.maxLength(3)]],
    expiryyear: ['',[Validators.required],[Validators.minLength(1)],[Validators.maxLength(3)]],
    fname: ['',[Validators.required]],
    lname: ['',[Validators.required]],
    zip:['',[Validators.required]]
  })
  Address= this.fb.group({
    phoneno: ['',[Validators.required]],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    zip:['',[Validators.required]],
    country:['',[Validators.required]]
  })
  ResetPassword = this.fb.group({
    oldpassword:['',[Validators.required]],
    newpassword:['',[Validators.required]],
    confirmpassword:['',[Validators.required]]
  })
  constructor(private kitchenService:KitchenService,private resturantservices:ResturantService, private router:Router,private global:GlobalService,private mapsAPILoader: MapsAPILoader,private userservices:UserService,private eleRef: ElementRef,private fb:FormBuilder,private toastr:ToastrService,private ngZone: NgZone) { }
  private geoCoder;
  @ViewChild('address')
  public searchElementRef: ElementRef;
  @ViewChild('city')
  public city: ElementRef;
  @ViewChild('country')
  public country:ElementRef
  ngOnInit() {
    this.global.header = 3;
    this.userservices.getUser();
    if(this.userservices.user == null || this.userservices.user == undefined){
      this.router.navigate(['/detail']);
    }
    this.userdata =this.userservices.user;
    this.Profile.controls['email'].setValue(this.userdata.email);
    this.Profile.controls['lastname'].setValue(this.userdata.lastname);
    this.Profile.controls['firstname'].setValue(this.userdata.firstname);


    this.getCustomerRating();
    this.getCustomer();
    this.getAllKitchen().then((allKitchenRes)=>{
      if(allKitchenRes){
        this.getOrderDetails();
      this.allItems().then((allItemRes)=>{
        if(allItemRes){
        this.getFavourite();
        }
      })
    }
    });
 

    this.mapsAPILoader.load().then(() => {

      this.setCurrentLocation();
 
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


          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat().toString();
          this.lng = place.geometry.location.lng().toString();
        
          this.getAddress(this.lat,this.lng);
        });
      });
    });
  }
  addCard(){
  
    this.userservices.verfityCard(this.Card.value).subscribe((data:any)=>{
      if(!data.error){
        if(data.message.txn != undefined){
          this.toastr.error(data.message.txn.errorMessage)
        }else{
          this.toastr.error("Sucessfully Added");
        }
      }
    },(error)=>{
      console.log(error);
    })
  }
  getCustomer(){
    this.userservices.getCustomer(this.userdata._id).subscribe((data:any)=>{
      this.customerAddress = data.message.customeraddresses[0];
      console.log(this.customerAddress);
    },(error)=>{
      console.log(error);
    })  
  }
  deleteUserAddress(){
    let userid = {
      "_id":this.userdata._id
    }
    this.userservices.addCustomerAdress(this.userdata._id,userid).subscribe((data:any)=>{
      if(!data.error){
        this.customerAddress = data.message.customeraddresses;
        console.log(this.customerAddress);
      console.log(data.message.customeraddresses,"After Delete")
        this.toastr.success("Address Has Been Removed")
      }
    },(error)=>{
      console.log(error);
    })
  }

  getFavourite(){
    this.resturantservices.favouriteList(this.userdata._id).subscribe((data:any)=>{


      let item = data.message[0].customerfavrestro[0].items;
      let favourite = new Map();
     
      for(let i = 0 ; i < item.length;i++){
        let kitchenid = this.items[item[i]].kitchenId;
       if(favourite[kitchenid] == undefined){
         favourite.set(kitchenid,new Object());
         favourite[kitchenid] = new Object();
         favourite[kitchenid].resturantName = this.allKitchens[kitchenid].restaurantname;
         favourite[kitchenid].item = new Array();
         favourite[kitchenid].item.push(this.items[item[i]]);
        }else{
          favourite[kitchenid].item.push(this.items[item[i]]);
        }
     }
     this.favouriteItems = favourite;

      this.convertMaptoArray(favourite).then((converted)=>{
      this.favouriteItems = converted;


      })
    },(error)=>{
      console.log(error);
    })
  }
  allItems(){
    return new Promise((resolve,reject)=>{
    this.resturantservices.allItems().subscribe((data:any)=>{
      if(!data.error){
        this.items = new Map();
        let all = data.message;
        for(let i = 0 ; i < all.length;i++){
          this.items[all[i]._id] = all[i];
        }
       
        resolve(true);
      }else{
        reject(false);
      }
    })
  })
  }
  updateProfile(){
  let postProfile = this.Profile.value;
  postProfile._id = this.userdata._id;
  postProfile.username = postProfile.email;

    this.userservices.UpdateProfile(this.userdata._id,postProfile).subscribe((data:any)=>{
    if(!data.error){
      this.toastr.success("Profile Updated !");
    }else{
      this.toastr.error(data.message);
    }
    },(error)=>{
      this.toastr.success("Unexpected Error");
    });
  }
  selectOrder(order){
this.orderForPopup = order;
console.log(this.orderForPopup,"uploaded");
  }
  SelectPorder(order){
    this.porderForPopup = order;
  }
  getOrderDetails(){
    this.userservices.getUserOrder(this.userdata._id).subscribe((data:any)=>{
      let orders = data.message;
      let neworders = new Array();
      let porders = new Array();
      for(let i = 0 ; i < orders.length;i++){
        if(orders[i].combo == undefined){
          continue;
        }
        orders[i].kitchenDetail = this.allKitchens[orders[i].restaurantid];
        neworders.push(orders[i]);
        if(orders[i].status == "delivered"){
          porders.push(orders[i]);
        }
      }
      this.allOrders = neworders;
      this.pastOrders = porders;
      console.log(this.allOrders);
    },(error)=>{
      console.log(error);
    })
  }
  ResetPass(){
    if(this.ResetPassword.get('newpassword').value == this.ResetPassword.get('confirmpassword').value){
      this.checkpassword = false;
      let credentails = this.ResetPassword.value;
      credentails.match = true;
      credentails._id = this.userdata._id;
      this.userservices.changePassword(this.userdata._id,credentails).subscribe((data:any)=>{
        if(data.error){
          this.toastr.error(data.message);
        }else{
          this.toastr.success("Your Password has been changed sucessfully")
          this.eleRef.nativeElement.querySelector('#closeRP').click();
        }

      },(error)=>{
        console.log(error);
      })
    }else{
      this.checkpassword = true;
    }
  }
  getCustomerRating(){
    this.userservices.getCustomerRating(this.userdata._id).subscribe((data:any)=>{
 
    },(error)=>{
      console.log(error);
    })
  }
  get cellphone(){
    return this.Profile.get('cellphone');
  }
  get dob(){
    return this.Profile.get('dob');
  }
  get homephone(){
    return this.Profile.get('homephone');
  }
  get firstname(){
    return this.Profile.get('firstname');
  }
  get lastname(){
    return this.Profile.get('lastname');
  }
  get email(){
    return this.Profile.get('email');
  }
  get address(){
    return this.Card.get('address');
  }
  get cardnumber(){
    return this.Card.get('cardnumber');
  }
  get cvv(){
    return this.Card.get('cvv');
  }
  get expirymonth(){
    return this.Card.get('expirymonth');
  }
  get expiryyear(){
    return this.Card.get('expiryyear');
  }
  get fname(){
    return this.Card.get('fname');
  }
  get lname(){
    return this.Card.get('lname');
  }
  get zip(){
    return this.Card.get('zip');
  }
  get oldpassword(){
    return this.ResetPassword.get('oldpassword');
  }
  get newpassword(){
    return this.ResetPassword.get('newpassword');
  }
  get confirmpassword(){
    return this.ResetPassword.get('confirmpassword');
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
 
        
        this.lat = position.coords.latitude.toString();
        this.lng = position.coords.longitude.toString();
        this.getAddress( this.lat,this.lng );
      });
    }
  }
  getAddress(latitude, longitude) {

    this.geoCoder.geocode({ 'location': { lat: Number(latitude), lng: Number(longitude) } }, (results, status) => {
      if (status === 'OK') {

        let isCity = false;
        if (results[0]) {
          for(let i = 0 ; i < results.length && isCity == false;i++){
            let routes = results[i].types;
            for(let j = 0 ; j < routes.length;j++){
              let types = routes[j];
              if(types == 'locality'){
                this.Address.get('city').setValue(results[i].address_components[0].short_name.toLowerCase());
                isCity = true;
                break;
              }
            }
          }
      
          this.Address.get('address').setValue(results[0].formatted_address);
          
          this.Address.get('country').setValue(results[results.length-1].formatted_address.toLowerCase());

          
        }
      }
 
    });
  }
  markerDragEnd($event: any) {

    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }
  getAllKitchen(){
    return new Promise((resolve,reject)=>{
      this.kitchenService.allKitchen().subscribe((data:any)=>{

        let kitchens = data.message;
        this.allKitchens = new Map();
        for(let i = 0; i < kitchens.length;i++){
         this.allKitchens[kitchens[i]._id] = kitchens[i];
        }
        resolve(true);
      },(error)=>{

        
        reject(false);
      })
    })
  }
  addAddress(){
      this.userservices.addCustomerAdress(this.userdata._id,this.Address.value).subscribe((data:any)=>{
        console.log(data)
        
        if(data.error == true){

          this.toastr.error(data.message)
        }else{
          
        this.customerAddress = data.message.customeraddresses[0];
        console.log(this.customerAddress);
          this.eleRef.nativeElement.querySelector('#closeAdress').click();
          this.toastr.success("Added Sucessfully");
        }
      },(error)=>{
        console.log(error,"Add Address Error")
      })
  }
  convertMaptoArray(map:any){
    return new Promise((resolve,reject)=>{
      let ret = [];

        map.forEach((val, key) => {

            ret.push(map[key]);
        });
        resolve(ret);
    })
  }
}










