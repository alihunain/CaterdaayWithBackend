import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/Services/user.service';
import { ToastrService } from 'ngx-toastr';
import  { KitchenService} from '../../../Services/kitchen.service'
import { GlobalService } from '../../../Services/global.service'
import {CartService} from '../../../Services/cart.service'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 
  User:any=null;
  Countrys:any;
  Signin:boolean= true;
  Countryname:string ="Select Country";
  constructor(public global: GlobalService,public userService:UserService,private toastr: ToastrService,private kitchenservice:KitchenService,private cart:CartService) { }
  showCart = false;
  ngOnInit() {
    this.getCountries();
    this.Signin= true;
    this.userService.checkCurrentUser.subscribe(res =>{
      console.log(this.userService.user,"user in subscribe");
      if(this.userService.user != undefined && this.userService.user != null){
        this.Signin = false;
      }else{
        this.Signin = true;
      }
      console.log("hit")
   });
   
   this.userService.getUser();
   this.userService.UserUpdate(true);
  //  let login = this.eleRef.nativeElement.querySelector("loginn");
  //  console.log(login);
  //  this.userService.UpdateLoginElement(login);
  }
  onSignout(){
    this.userService.removeUser();
    this.userService.UserUpdate(false);
    this.toastr.success("Sign Out")
  }
  cartBoxAction(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.showCart = !this.showCart;
  }
  checkUser(){
    this.User = this.userService.getUser();
      if(!this.User === null){
        this.Signin = false;
      }
  }
  getCountries(){
   this.userService.GetCountryList().subscribe((data:any)=>
   {
     this.Countrys=data.message;
     for(let i = 0 ; i < this.Countrys.length;i++){
       console.log(this.Countrys[i].countryName);
     }
     console.log(this.Countrys)
    },error=>{
      console.log(error)
    })
  }
 
  Change(selectedCountry: string){
 
    this.Countryname = selectedCountry;
    this.kitchenservice.filterKitchen.city = "";
    this.kitchenservice.filterKitchen.country = "";
    this.kitchenservice.address = "";
    this.kitchenservice.filterKitchen.country =this.Countryname;
  }
 
}
