import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl} from '@angular/forms'
import { Validators } from '@angular/forms'
import { UserService } from '../../../Services/user.service'
import { User } from '../../Models/User'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  Loginuser = new User();
  signupUser = new User();
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
  forgetPassword = this.fb.group({
    email:['',[Validators.email,Validators.required]],
  })
  constructor(private fb:FormBuilder,private userService:UserService,private eleRef: ElementRef,private toastr: ToastrService) { 
    
  }
  onSignup(){
    this.Compare();
    if(this.current){
    this.signupUser.email = this.username.value;
    this.signupUser.username = this.username.value;
    this.signupUser.firstname = this.firstname.value;
    this.signupUser.lastname = this.lastname.value;
    this.signupUser.password = this.password.value;
    let body = {
      email:this.signupUser.email
    }
    this.userService.Signup(this.signupUser).subscribe((data:any)=>{
      if(!data.error){
        this.toastr.success('Verify Your Email Before Login');
     
        this.userService.AddSubscriber(body).subscribe((data:any)=>{
        
        })
        this.eleRef.nativeElement.querySelector('#closeReg').click();
      }
    },(error)=>{
      this.toastr.error('Something Went Wrong');
    })
  }
  }
  onLogin(){
    this.Loginuser.username =this.loginusername.value;
    this.Loginuser.password = this.loginpassword.value; 
    this.userService.Login(this.Loginuser).subscribe((data:any)=>{

      if(!data.error){
        this.userService.user = data.data;
        this.userService.setUser();
        this.toastr.success( 'You are now login');
        this.userService.UserUpdate(true);
       this.switchRegister();
      }else{
        this.toastr.error(data.data);
      }
     
    },(error)=>{
      this.toastr.error('Unauthorized');
    })
  }
 
  OnFP(){
    this.userService.forgetPassword(this.forgetPassword.value).subscribe(data=>{
      this.toastr.success('Password reset email has been send to your email address');
      this.eleRef.nativeElement.querySelector('#closeFP').click();
    },(error)=>{
      this.toastr.warning('Something Went Wrong');
    })
  }
  ngOnInit() {
     this.userService.getUser();
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
  get email(){
    return this.forgetPassword.get('email');
  }
  switchRegister(){
  this.eleRef.nativeElement.querySelector('#closeLogin').click();
  }
  switchLogin(){
    this.eleRef.nativeElement.querySelector('#closeReg').click();
    this.eleRef.nativeElement.querySelector('#closeFP').click();
  }
  switchFP(){
    this.eleRef.nativeElement.querySelector('#closeLogin').click();
  }
  Compare(){
 
   let pass = this.password.value;
   let confirm = this.confirmpassword.value;
  
   if(pass != confirm){
     this.current = false;
   }else{
     this.current = true;
   }
  }
  ForgetPassword(){
  }
}
