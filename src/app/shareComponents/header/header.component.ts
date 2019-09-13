import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/Services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  User:any=null;
  Countrys:any =null;
  Signin:boolean= true;
  constructor(public userService:UserService) { }
  showCart = false;
  ngOnInit() {
      this.getCountries();
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
     this.Countrys=data
     console.log(this.Countrys)
    },error=>{
      console.log(error)
    })
  }
 
}
