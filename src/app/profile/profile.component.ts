import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { UserService } from '../../Services/user.service'
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService, ToastRef } from 'ngx-toastr';
import { MapsAPILoader } from '@agm/core';
import { GlobalService } from '../../Services/global.service'
import { Router, ActivatedRoute } from '@angular/router';
import { KitchenService } from '../../Services/kitchen.service'
import { ResturantService} from '../../Services/resturant.service'
import { PARAMETERS } from '@angular/core/src/util/decorators';

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
  zoom=1;
  checkpassword:boolean=false;
  mapaddress:string;
  favouriteItems:any;
  allKitchens:any;
  customerAddress:any;
  allOrders:any;
  pastOrders:any;
  orderForPopup:any;
  porderForPopup:any;
  currentclass="account";
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
    cardnumber: ['',[Validators.required]],
    cvv: ['',[Validators.required]],
    expirymonth: ['',[Validators.required]],
    expiryyear: ['',[Validators.required]],
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
  validCvv:boolean=true;
  validCn:boolean=true;
  validM:boolean=true;
  validY:boolean=true;
  private geoCoder;




  constructor(private route: ActivatedRoute,private kitchenService:KitchenService,private resturantservices:ResturantService, private router:Router,private global:GlobalService,private mapsAPILoader: MapsAPILoader,private userservices:UserService,private eleRef: ElementRef,private fb:FormBuilder,private toastr:ToastrService,private ngZone: NgZone) { }
 

  @ViewChild('city')
  public city: ElementRef;
  @ViewChild('country')
  public country:ElementRef
   ngOnInit() {
    this.global.header = 3;
    this.checkLogin();
    this.userdata =this.userservices.user;
    this.route.queryParams.subscribe(params=>{
      this.currentclass = params["point"];
      if(this.currentclass != "account" && this.currentclass != "favourite" && this.currentclass != "orders"){
        this.currentclass = "account"
      }
      console.log(this.currentclass);
    })
    
    console.log(this.currentclass);
    this.setProfileValues();
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

    });
  }
  verifyCard(){
    
    this.userservices.verfityCard(this.Card.value).subscribe((data:any)=>{
      if(!data.error){
        // if(data.message.txn != undefined){
        //   this.toastr.error(data.message.txn.errorMessage)
        // }else{
        //   this.toastr.error("Sucessfully Added");
        // }
        if(data.message.txn.errorCode == undefined && data.message.txn.ssl_result_message != "INVALID CARD"){
        let card = this.Card.value;
        card.email = this.userdata.email;
        this.generateCardToken(card);
       }else{
         this.toastr.error(data.message.txn.errorMessage || data.message.txn.ssl_result_message);
       }
      }
    },(error)=>{
      console.log(error);
    })
  }
  generateCardToken(credentials){
    this.userservices.generateToken(credentials).subscribe((data:any)=>{
      let res = data.message.txn;
    let card = {
      cardinfo: [{
      cardnumber:res.ssl_card_number,
      cardtype:res.ssl_card_short_description,
      default:true,
      token:res.ssl_token,
    }],_id:this.userdata._id
  }
  this.addCard(card);

    },(error)=>{
      console.log(error);
    })
  }
  addCard(cardinfo){

    this.userservices.UpdateProfile(this.userdata._id,cardinfo).subscribe((data:any)=>{
      if(!data.error){
        this.toastr.success("Sucessfully Added");
        this.getCustomer();
        this.eleRef.nativeElement.querySelector("#closeCardForm").click();
      }else{
        this.toastr.error(data.message);
      }
    })
  }
  deleteCard(){

    let update = {
      cardinfo:[]
    }
    this.userservices.UpdateProfile(this.userdata._id,update).subscribe((data:any)=>{
      if(!data.error){
        this.getCustomer();
        this.toastr.success("Sucessfully Deleted");
      }
    })
    }
  getCustomer(){
    this.userservices.getCustomer(this.userdata._id).subscribe((data:any)=>{
      this.customerAddress = data.message.customeraddresses[0];
      this.userdata = data.message;
      this.userservices.user = data.message;
      this.userservices.setUser();
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
 
 
        this.toastr.success("Address Has Been Removed")
      }
    },(error)=>{
      console.log(error);
    })
  }

  getFavourite(){
    this.resturantservices.favouriteList(this.userdata._id).subscribe((data:any)=>{
      console.log(data);
      if(data.message[0].customerfavrestro.length == 0){
        this.favouriteItems = new Array();
        return;
      }
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
      this.getCustomer();
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
  autoComplete(){
    let autocomplete = new google.maps.places.Autocomplete(this.eleRef.nativeElement.querySelector("#address"), {
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
  }


  getAllKitchen(){
    console.log("I am hitting kitchen");
    return new Promise((resolve,reject)=>{
      this.kitchenService.allKitchen().subscribe((data:any)=>{

        console.log("I am hitting kitchen");
        let kitchens = data.message;
        this.allKitchens = new Map();
        for(let i = 0; i < kitchens.length;i++){
         this.allKitchens[kitchens[i]._id] = kitchens[i];
        }
        resolve(true);
      },(error)=>{

        console.log("I am hitting kitchen");
        
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

        this.getCustomer();
          this.eleRef.nativeElement.querySelector('#closeAdress').click();
          this.toastr.success("Added Sucessfully");
        
        }
      },(error)=>{
        console.log(error,"Add Address Error")
      })
  }
















  //<-- Start -->
  convertMaptoArray(map:any){
    return new Promise((resolve,reject)=>{
      let ret = [];

        map.forEach((val, key) => {

            ret.push(map[key]);
        });
        resolve(ret);
    })
  }
   // <-- End -->
  // Address From  Google Map Function <-- Start -->
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
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
 
        
        this.lat = position.coords.latitude.toString();
        this.lng = position.coords.longitude.toString();
        this.getAddress( this.lat,this.lng );
      });
    }
  }
   // Address From  Google Map Function <-- End -->




 // Reactive Forms Properties  <-- Start -->
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
    let card = this.Card.get('cardnumber').value;
    this.Card.get('cardnumber').setValue(this.formatCn(card)); 
    return this.Card.get('cardnumber');
  }
  get cvv(){

    if(this.Card.get('cvv').value.length != 3){
      this.validCvv = false;
    }else{
      this.validCvv = true;
    }
    return this.Card.get('cvv');
  }
  get expirymonth(){
    if(this.Card.get('expirymonth').value.length != 2){
      this.validM = false;
    }else{
      this.validM = true;
    }
    return this.Card.get('expirymonth');
   
  }
  get expiryyear(){
    if(this.Card.get('expiryyear').value.length != 2){
      this.validY = false;
    }else{
      this.validY = true;
    }
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
   // Reactive Forms Properties  <-- End -->

   // <-- Is User Available  -->
   checkLogin(){
    this.userservices.getUser();
    if(this.userservices.user == null || this.userservices.user == undefined){
      this.router.navigate(['/detail']);
    }
   }


    // <-- Add Values To Profile Form Textbox  -->
   setProfileValues(){
    this.Profile.controls['email'].setValue(this.userdata.email);
    this.Profile.controls['lastname'].setValue(this.userdata.lastname);
    this.Profile.controls['firstname'].setValue(this.userdata.firstname);
   }
   formatCn(number){
     let currentcurrent= "";
     for(let i = 0 ; i < number.length;i++){
       if(number[i] == '-'){
         continue;
       }else{
         currentcurrent+=number[i];
       }
     }
     if(currentcurrent.length != 16){
       this.validCn =false;
     }else{
       this.validCn = true;
     }
     let final = "";
     for(let i = 0; i < currentcurrent.length;i++){

       if((i) % 4 == 0 && i != 0){
       
         final+= '-' + currentcurrent[i];
       }else{
         final+= currentcurrent[i];
       }
     }
     return final;
   }
   
}










