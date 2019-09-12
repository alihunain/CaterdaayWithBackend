import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl} from '@angular/forms'
import { Validators } from '@angular/forms'
import { UserService } from '../../../Services/user.service'
import { User } from '../../Models/User'
import {CustomValidators} from '../../Validation/CustomValidation'
import { truncate } from 'fs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  Loginuser = new User();
  current:boolean = true;
  Signup = this.fb.group({
    firstname:['',[Validators.required]],
    lastname:['',[Validators.required]],
    username:['',[Validators.email]],
    password:['',[Validators.required]],
    confirmpassword:['',[Validators.required]],
  })
  Login = this.fb.group({
    loginusername:['',[Validators.email]],
    loginpassword:['',[Validators.required]],
  })
  constructor(private fb:FormBuilder,private userService:UserService,private eleRef: ElementRef) { 
    
  }
  onSignup(){
    this.Compare();
    if(this.current){
    let user = this.Signup.value;
    this.userService.Signup(user).subscribe(data=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    })
  }
  }
  onLogin(){
    this.Loginuser.username =this.loginusername.value;
    this.Loginuser.password = this.loginpassword.value; 
    this.userService.Login(this.Loginuser).subscribe(data=>{
     console.log(data);
    },(error)=>{
      console.log(error);
    })
  }
  ngOnInit() {
  }
  get loginusername(){
    return this.Login.get('loginusername');
  }
  get username(){
    return this.Signup.get('username');
  }
  get firstname(){
    return this.Signup.get('firstname');
  }
  get lastname(){
    return this.Signup.get('lastname');
  }
  get password(){
    return this.Signup.get('password');
  }
  get confirmpassword(){
    return this.Signup.get('confirmpassword');
    
  }
  get loginpassword(){
    return this.Login.get('loginpassword');
  }
  switchRegister(){
  this.eleRef.nativeElement.querySelector('#closeLogin').click();
  }
  switchLogin(){
    console.log("working")
    this.eleRef.nativeElement.querySelector('#closeReg').click();
  }
  Compare(){
    console.log(this.password.value);
   let pass = this.password.value;
   let confirm = this.confirmpassword.value;
   console.log(confirm);
   if(pass != confirm){
     this.current = false;
   }else{
     this.current = true;
   }
  }
}
