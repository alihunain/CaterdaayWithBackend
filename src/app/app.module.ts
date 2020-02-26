import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './shareComponents/header/header.component';
import { FooterComponent } from './shareComponents/footer/footer.component';
import { InnerCateringSearchComponent } from './inner-catering-search/inner-catering-search.component';
import { InnerSearchComponent } from './inner-search/inner-search.component';
import { InnerheaderComponent } from './shareComponents/innerheader/innerheader.component';
import { InnerFooterComponent } from './shareComponents/inner-footer/inner-footer.component';
import { ScrollEnteranceDirective } from './Directive/scroll-enterance.directive';
import { CartComponent } from './shareComponents/cart/cart.component';
import { BackToTopDirective } from './Directive/back-to-top.directive';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactusComponent } from './contactus/contactus.component';
import { TestimonialsComponent } from './shareComponents/testimonials/testimonials.component';
import { Footer2Component } from './shareComponents/footer2/footer2.component';
import { SignupComponent } from './shareComponents/signup/signup.component';
import { DriverSignupComponent } from './driver-signup/driver-signup.component';
import { OnboardingComponent } from './shareComponents/onboarding/onboarding.component';
import { EarnComponent } from './earn/earn.component';
import { BuyerIntroComponent } from './buyer-intro/buyer-intro.component';
import { BuyerMenuComponent } from './buyer-menu/buyer-menu.component';
import { Header3Component } from './shareComponents/header3/header3.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ChefComponent } from './chef/chef.component';
import { ChefIntroComponent } from './chef-intro/chef-intro.component';
import { FaqComponent } from './faq/faq.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { CarouselModule  } from 'ngx-owl-carousel-o';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MobileAppComponent } from './shareComponents/mobile-app/mobile-app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { ProfileComponent } from './profile/profile.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { WaiterSignupComponent } from './waiter-signup/waiter-signup.component';
import { ResturantCountComponent } from './shareComponents/resturant-count/resturant-count.component';
import { PrivacyNPolicyComponent } from './privacy-n-policy/privacy-n-policy.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { FileSelectDirective,FileUploadModule } from 'ng2-file-upload';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    InnerCateringSearchComponent,
    InnerSearchComponent,
    InnerheaderComponent,
    InnerFooterComponent,
    ScrollEnteranceDirective,
    CartComponent,
    BackToTopDirective,
    AboutUsComponent,
    ContactusComponent,
    TestimonialsComponent,
    Footer2Component,
    SignupComponent,
    DriverSignupComponent,
    OnboardingComponent,
    EarnComponent,
    BuyerIntroComponent,
    BuyerMenuComponent,
    Header3Component,
    CheckoutComponent,
    ChefComponent,
    ChefIntroComponent,
    FaqComponent,
    TermsConditionsComponent,
    MobileAppComponent,
    ProfileComponent,
    ThankyouComponent,
    WaiterSignupComponent,
    ResturantCountComponent,
    PrivacyNPolicyComponent,

  
    
  ],
  imports: [

    BrowserModule,

    BrowserAnimationsModule,
    AppRoutingModule,
    CarouselModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularDateTimePickerModule,
    FileUploadModule,
    ToastrModule.forRoot({
      easing:'ease-in',
      easeTime:3000,
      timeOut:5000,
      closeButton:false,
      resetTimeoutOnDuplicate:false,
      preventDuplicates: true,
      countDuplicates:true,
    
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyARx-cMveE9u02YQexvqbxWcemL0nE4UjA',
      libraries: ['places']
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
