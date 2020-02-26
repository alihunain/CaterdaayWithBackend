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
  wait=false;
  resetemailvalid = false;
  loginemailvalid = false;
  signupemailvalid = false;
  Loginuser = new User();
  signupUser = new User();
  current:boolean = true;
  loginpass:boolean = true;
  signuppass:boolean = false;
  currenturl:any;
  resetid:any;
  confirmreset:boolean = false;
  resetpass:boolean = false;
  signupemailtouch =false;
  loginemailtouch  =false;
  fpemailtouch =false;
  Signup = this.fb.group({
    firstname:['',[Validators.required]],
    lastname:['',[Validators.required]],
    username:['',[Validators.email,Validators.required]],
    password:['',[Validators.required]],
    confirmpassword:['',[Validators.required]],
  })
  Login = this.fb.group({
    loginusername:['',[Validators.email,Validators.required]],
    loginpassword:['',[Validators.required]],
  })
  forgetPassword = this.fb.group({
    email:['',[Validators.email,Validators.required]],
  })
  reset = this.fb.group({
    passwordd:['',[Validators.required]],
    confirm:['',[Validators.required]],
  })
  constructor(private fb:FormBuilder,private userService:UserService,private eleRef: ElementRef,private toastr: ToastrService) { 
    
  }
  checkurl(){
    this.currenturl = window.location.href;
    let checker = this.currenturl.split('/');
  
    if(checker[checker.length-2] == 'reset-password' && checker[checker.length-3] == 'customer' ){
 
      this.resetid = checker[checker.length-1];

      this.eleRef.nativeElement.querySelector('#change').click();
    
      // let data = {_id:checker[checker.length-1],status:true}
      // this.userService.MailActivaion(data).subscribe((res:any)=>{
      //   console.log(res);
      // })
    }
  }
  Onreset(){
    this.wait = true;
    let pass = this.reset.get('passwordd').value;
    let passtwo = this.reset.get('confirm').value;
    if(pass != passtwo){
      this.toastr.error("Password Didn't Match");
      return;
    }
    let obj = {
        newpassword:pass,password:pass
      }
      this.userService.resetPassword(obj,this.resetid).subscribe((data:any)=>{
        this.wait = false;
        this.toastr.success("Password Changed Sucessfully");
        this.eleRef.nativeElement.querySelector("#closeRP").click();
      },(error)=>{
        this.wait = false;
      });
     
  }
  onSignup(){
    this.wait = true;
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
      this.wait = false;
      if(!data.error){
        this.toastr.success('User Registered Successfully. Please Verify your Email Before Login');
        
        this.userService.AddSubscriber(body).subscribe((data:any)=>{
        
        })
      
        this.eleRef.nativeElement.querySelector('#closeReg').click();
   
      }
    },(error)=>{
      this.wait = false;
      this.toastr.error('Something Went Wrong');
    })
  
  }else{
    this.wait = false;
  }
  }
  onLogin(){
    this.wait = true;

    this.Loginuser.username =this.loginusername.value;
    this.Loginuser.password = this.loginpassword.value; 
    this.userService.Login(this.Loginuser).subscribe((data:any)=>{
      this.wait = false;
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
      this.wait = false;
      this.toastr.error('Invalid email or password. Please try again.');
    })
  
  }
  RemoveDate(s){
   
    if(s == 'reset'){
      this.reset.reset();
    }else if(s == 'forgetpassword'){
      this.forgetPassword.reset();
    }else if(s == 'login'){
      this.Login.reset();
    }else if(s == 'signup'){
      this.Signup.reset();
    }
  }
  OnFP(){
    this.wait = true;
    this.userService.forgetPassword(this.forgetPassword.value).subscribe(data=>{
      this.wait = false;
      this.toastr.success('Password reset email has been send to your email address');
      this.eleRef.nativeElement.querySelector('#closeFP').click();
    },(error)=>{
      this.wait = false;
      this.toastr.warning('Something Went Wrong');
    })
  }
  ngOnInit() {
     this.userService.getUser();
   
  }
  ngAfterViewInit(){
    setTimeout(()=>{
this.checkurl();
    },2000)
  
  }
  get loginusername(){
    if( this.Login.get('loginusername') != null){
      if(this.Login.get('loginusername').value != undefined){
        if(this.Login.get('loginusername').touched){
          this.loginemailtouch = true;
         
        }
      this.loginemailvalid  = this.EmailAlgoChecker(this.Login.get('loginusername').value);
   
      }
    }
    return this.Login.get('loginusername');
  }
  get username(){
    if( this.Signup.get('username') != null){
      if(this.Signup.get('username').value != undefined){
        if(this.Signup.get('username').touched){
          this.signupemailtouch = true;
      
        }
        this.signupemailvalid  = this.EmailAlgoChecker(this.Signup.get('username').value);
  
      }
    }
    return this.Signup.get('username');
  }
  get firstname(){
    return this.Signup.get('firstname');
  }
  get lastname(){
    return this.Signup.get('lastname');
  }
  get password(){
    if( this.Signup.get('password') != null){
      if(this.Signup.get('password').value != undefined){
    let x = this.Signup.get('password').value;
    if(x.length < 6){
      this.signuppass = false;
    }else{
      this.signuppass = true;
    }
  }
  }
    return this.Signup.get('password');
  }
  get confirmpassword(){
    return this.Signup.get('confirmpassword');
    
  }
  get loginpassword(){
    if( this.Login.get('loginpassword') != null){
      if(this.Login.get('loginpassword').value != undefined){
   
    if(this.Login.get('loginpassword').value.length < 6){
      this.loginpass = false;
    }else{
      this.loginpass =true;
    }
  }
  }
    return this.Login.get('loginpassword');
  }
  get email(){
    if( this.forgetPassword.get('email') != null){
      if(this.forgetPassword.get('email').value != undefined){
        if(this.forgetPassword.get('email').touched){
          this.fpemailtouch = true;
   
        }
        
    this.resetemailvalid = this.EmailAlgoChecker(this.forgetPassword.get('email').value)
    return this.forgetPassword.get('email');
      }
    }
  }
  get passwordd(){
    if( this.reset.get('passwordd') != null){
      if(this.reset.get('passwordd').value != undefined){
    let x = this.reset.get('passwordd').value;
    if(x.length < 6){
      this.resetpass = false;
    }else{
      this.resetpass = true;
    }
  }
  }
    return this.reset.get('passwordd');
  }
  get confirm(){
    if( this.reset.get('confirm') != null){
      if(this.reset.get('confirm').value != undefined){
    if(this.passwordd.value != this.reset.get('confirm').value){
      this.confirmreset = false;
    }else{
      this.confirmreset = true;
    }
  }
  }
    return this.reset.get('confirm');
  }
  switchRegister(){
    this.ResetForms();
  this.eleRef.nativeElement.querySelector('#closeLogin').click();
  }
  switchLogin(){
    this.ResetForms();
    this.eleRef.nativeElement.querySelector('#closeReg').click();
    this.eleRef.nativeElement.querySelector('#closeFP').click();
  }
  switchFP(){
    this.ResetForms();
    this.eleRef.nativeElement.querySelector('#closeLogin').click();
  }
  ResetForms(){
    this.forgetPassword.reset();
    this.reset.reset();
    this.Login.reset();
    this.Signup.reset();
    this.loginemailtouch = false;
    this.signupemailtouch =false;
    this.fpemailtouch = false;
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

  EmailAlgoChecker(email){
      let dot = false;
      let at = false;
      for(let i  =email.length-2 ;i >=1;i--){
        if(!dot){
          if(email[i] == '.'){
            dot=true;
          }
        }else{
          if(email[i] == '@'){
            at =true;
            break;
          }
        }
      }
      if(at && dot){
        return true;
      }else{
        return false;
      }
  }
}
