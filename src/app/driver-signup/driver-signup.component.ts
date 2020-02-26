import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {DriverService} from '../../Services/driver.service';
import { GlobalService } from '../../Services/global.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
@Component({
  selector: 'app-driver-signup',
  templateUrl: './driver-signup.component.html',
  styleUrls: ['./driver-signup.component.css']
})

export class DriverSignupComponent implements OnInit {
  emailp: any = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  zipRE: any = /^\S+[a-z\d\-_\s]+$/i;
  emailvalid:boolean =false;
  passlenght:boolean = false;
  cpvalid:boolean =false;
  newFileName:any;
  uploaderOptions:any;
  count:any=0;
  wait:any=false;
  URL: any = this.global.development.ms1 + "upload/";
  ImgURL: any = this.global.development.ms1+ "uploads/";
  public uploader:FileUploader = new FileUploader({url: "https://www.caterdaay.com:4014/upload", allowedMimeType: ['image/JPEG','image/PNG','image/JPG','image/jpeg', 'image/png',  'image/jpg' ]});
  Driver = this.fb.group({

      username: [],
      email: ['', [Validators.required, Validators.email]], //Done
      password: ['', Validators.required], //Done
      cpassword: ['', Validators.required], // Done
      firstname: ['', Validators.required], //Done
      lastname: ['', Validators.required], //Done
      ByBank:[false],  // Done
      ByCheque:[true],  // Done
      paymentmethod:['',Validators.required], //Done
      AccountName:['', Validators.required], //Done
      AccountNumber:['',Validators.required], //Done
      BankName:['',Validators.required], //Done
      license: ["",Validators.required], //Done
      policecertificate: ["",Validators.required],
       carinsurance: ["",Validators.required],
       carnumberplate: ["",Validators.required],
       voidcheque: ["",Validators.required],
      zip:["", [Validators.required, Validators.pattern(this.zipRE)]],  // Done
      // termsAndCondition:[false,Validators.compose([Validators.pattern('true'), Validators.required])]

  })
  constructor(private router:Router,private toastr:ToastrService,private global:GlobalService,private fb:FormBuilder,private driver:DriverService) { }

  ngOnInit() {
    this.global.header = 2;
  //   this.uploaderOptions['fileKey'] = "file";
  //   this.uploaderOptions['chunkedMode'] = false;
  // this.uploaderOptions['mimeType']="multipart/form-data"
  //   this.uploader.setOptions(this.uploaderOptions);
    this.uploader.onAfterAddingFile = (file) => {
      console.log(this.uploader.queue);
     
      //create my name
      file.withCredentials = false;
      // file.file.name = Date.now() + " file.jpg";
      //save in variable
      // this.newFileName = file.file.name;
    };
    this.uploader.onBeforeUploadItem = (item) =>  {
    console.log(item.file.name);
      item.file.name;
    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.count++;
      let res = JSON.parse(response);
      this.UpdateName("voidcheque",item.file.name,res.filename);
      this.UpdateName("policecertificate",item.file.name,res.filename);
      this.UpdateName("carinsurance",item.file.name,res.filename);
      this.UpdateName("carnumberplate",item.file.name,res.filename);
      this.UpdateName("license",item.file.name,res.filename);
      console.log(this.Driver.value);
      console.log(res.filename);
      if(this.count == 5){
      let driverDetails = this.Driver.value;
      driverDetails['termsAndCondition'] = true;
      this.driver.Signup(driverDetails).subscribe((data:any)=>{
        if(!data.error){
          this.toastr.success('Your request for driver registration has been submitted. Please verify your account by clicking on the link provided in the email');
          this.router.navigate(['/']);
          
        }
        this.wait = false;
      },(error:any)=>{
         console.log(error);
         this.wait = false;
      })
     } 
    }; 
  }

  UpdateName(name,fname,updated){
    if(this.Driver.get(name).value.includes(fname)){
      this.Driver.controls[name].setValue(updated);
    }
  }
  get email(){
    this.emailvalid = this.emailcheck(this.Driver.get('email').value);
    return this.Driver.get('email');
  }
  get password(){
    let pass = this.Driver.get('password').value;
    let cp =  this.Driver.get('cpassword').value;
    if(pass.length < 8){
      this.passlenght = true;
    }else{
      this.passlenght = false;
    }

    if(cp != pass){
  this.cpvalid = false;
    }else{
      this.cpvalid = true;
    }
    return this.Driver.get('password');
  }
  get cpassword(){
    let cp =  this.Driver.get('cpassword').value;
    let pass = this.Driver.get('password').value;
    if(cp != pass){
      this.cpvalid = false;
        }else{
          this.cpvalid = true;
        }
    return this.Driver.get('cpassword');
  }

  get firstname(){
    return this.Driver.get('firstname');
  }
  get lastname(){
    return this.Driver.get('lastname');
  }
  get paymentmethod(){
    return this.Driver.get('paymentmethod');
  }
  get AccountName(){
    return this.Driver.get('AccountName');
  }
  get AccountNumber(){
    return this.Driver.get('AccountNumber');
  }
  get BankName(){
    return this.Driver.get('BankName');
  }
  get zip(){
    return this.Driver.get('lastname');
  }
  Update(data){
    let selected = data.value; 
    console.log("update hhit")
    if(selected == 'By Bank'){
      this.Driver.controls['ByBank'].setValue(true);
      this.Driver.controls['ByCheque'].setValue(false);
    }else{
      this.Driver.controls['ByBank'].setValue(false);
      this.Driver.controls['ByCheque'].setValue(true);
    }
  }
  driverSignup(){
    this.wait = true;
    this.Driver.controls['username'].setValue(this.email.value);
    console.log(this.Driver.value);
     this.uploader.uploadAll();
   
   }
   emailcheck(email){
     if(email.includes('@') && email.includes('.')){
       let atcheck = false;
       let dotcheck = false;
       for(let i = 0; i < email.length;i++){
         if(email[i] == '@'){
           atcheck= true;
         }
         if(email[i] == '.' && atcheck && i+1 != email.length){
           dotcheck = true;
         }
       }
       if(dotcheck && atcheck){
         return true;
       }else{
         return false;
       }
     }else{
       return false;
     }
   }
   private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
   public onChange(event,data) {
    let modifiedtime = Date.now();
    console.log(modifiedtime);
    var extarray = ["jpeg","jpg","png", "JPEG","JPG","PNG"];
    var files = event.target.files;
    if(files[0] == undefined){
      if(data == 'cheque'){
        this.Driver.controls['voidcheque'].setValue("");
      }else if(data == 'police'){
        this.Driver.controls['policecertificate'].setValue("");
      }else if(data == 'insurance'){
        this.Driver.controls['carinsurance'].setValue("");
      }else if(data == 'numplate'){
        this.Driver.controls['carnumberplate'].setValue("");
      }else{
        this.Driver.controls['license'].setValue("");
      }
      return;
    }
    var farr = files[0].name.split(".");
    console.log(farr);
    var ext = farr[farr.length - 1];        
    if(extarray.indexOf(ext) != -1){
    if(data == 'cheque'){
      this.Driver.controls['voidcheque'].setValue(files[0].name);
    }else if(data == 'police'){
      this.Driver.controls['policecertificate'].setValue(files[0].name);
    }else if(data == 'insurance'){
      this.Driver.controls['carinsurance'].setValue(files[0].name);
    }else if(data == 'numplate'){
      this.Driver.controls['carnumberplate'].setValue(files[0].name);
    }else{
      this.Driver.controls['license'].setValue(files[0].name);
    }
   
    }else{
      if(data == 'cheque'){
        this.Driver.controls['voidcheque'].setValue("");
      }else if(data == 'police'){
        this.Driver.controls['policecertificate'].setValue("");
      }else if(data == 'insurance'){
        this.Driver.controls['carinsurance'].setValue("");
      }else if(data == 'numplate'){
        this.Driver.controls['carnumberplate'].setValue("");
      }else{
        this.Driver.controls['license'].setValue("");
      }
     
    }
  }

}


