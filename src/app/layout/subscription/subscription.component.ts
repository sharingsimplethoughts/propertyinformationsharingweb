import { Component, OnInit } from '@angular/core';
import { ApiService} from '../../service/api/api.service';
import { ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
declare var $:any;
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';


import {Router} from '@angular/router';
 
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriptiondata =[];
  account_type;
  add_pictures_link_to_others_posts;
  comment_on_existing_posts;
  create_posts;
  created_on;
  mark_involvement_in_others_posts;
  plan_desc;
  plan_name;
  price;
  users_or_account;
  errormessage;

  elements: Elements;
  card: StripeElement;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  stripeTest: FormGroup;
  userData: any;
  userId: any;


  constructor(private api:ApiService,
    private router:Router,
    private toastr:ToastrService,
    private fb: FormBuilder,
    private af :AngularFireDatabase,
    private stripeService: StripeService) { }

  ngOnInit() {
    this.getSubscriptionData(); 
    
    // stripe 
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            hidePostalCode: true,
            style: {
              base: {
                iconColor: '#000',
                color: '#000',
                lineHeight: '60px',
                fontWeight: 300,
                fontFamily: 'sans-serif',
                fontSize: '15px',
                '::placeholder': {
                  color: '#7e7f82'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });

      // stripe end
  }
  userState(){
    debugger
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.userId = this.userData.id
    
            let timestamp = new Date().getTime().toString()
            let dataTOSave = {
              id: this.userId,
              name: this.userData.company_detail['name'],
              onlineState: '1',
              profile_image: this.userData.company_detail['picture'],
              username: this.userData.username,
              timeStamp: timestamp,
            }
    
          this.af.database.ref('/userState/' + this.userId).set(dataTOSave)
      }

success_message;
  proceedtopay() {

      const name = this.stripeTest.get('name').value;
      if(name == ''){
        this.errormessage = "Please Provide Card Holder Name"
      }else{
      this.stripeService
        .createToken(this.card, { name })
        .subscribe(result => {
          if (result.token) {
            console.log(result.token);
            var data = result.token
            var card_token = data.id
            this.api.make_payment({card_token:card_token, is_card_save:true}).subscribe( x =>{
              console.log(x['message'])
              this.success_message = x['message']
                $('#checkout').modal('hide')
              $('#paidsuccess').modal('show')
          //     this.api.setUserData(response.data)
          // this.userState()
            })
          } else if (result.error) {
            // Error creating the token
            console.log(result.error.message);
          }
        });
    }
  }
  captured
  setHome(){
    this.captured = true
    localStorage.setItem("captured", this.captured)
  }

getSubscriptionData(){

  this.api.get_subscription_plan().subscribe(x =>{
    console.log(x)
    this.subscriptiondata = x['data']
  this.account_type = this.subscriptiondata['account_type'];
  this.add_pictures_link_to_others_posts =this.subscriptiondata['add_pictures_link_to_others_posts'];
  this.comment_on_existing_posts =this.subscriptiondata['comment_on_existing_posts'];
  this.create_posts =this.subscriptiondata['create_posts'];
  this.mark_involvement_in_others_posts =this.subscriptiondata['mark_involvement_in_others_posts'];
  this.users_or_account =this.subscriptiondata['users_or_account'];
  this.plan_name  = this.subscriptiondata['plan_name'];
  // created_on;  
  // plan_desc;
  // plan_name;
  // price;
  
  })
}

}


