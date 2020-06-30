import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms'
declare var $:any;
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../service/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  colleagues = [];
  profiledata:any
  projectdata = []
  followdata  :any
  colleague_id;
  errormessage;
  colleagueForm;
  submitted : boolean = false;
  userTag = new FormControl('');
  message
  tagsList = []
  d
  userTagsList = []
  taggedUsers: []
  userTaggs :any = [];
  userName
  constructor(private api:ApiService, private Toast:ToastrService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userData') != undefined ? JSON.parse(localStorage.getItem('userData')).username : "";
    this.errormessage='';
    this.submitted = false;
    this.colleagueForm = new FormGroup({
      username: new FormControl(''),
      mobile_number: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')    
    });


    setTimeout(()=> {

      $('.colleague-profile> ul> li').on("click", function(){
        $(this).find('.colleague-details').slideToggle('slow');
        $(this).find('span>i').toggleClass('fa fa-caret-down').toggleClass('fa fa-caret-up');
      })
      .on("dblclick", function(){
        $(this).find('.back-dark').toggleClass('add-gray');    
        $(this).find('.com').toggleClass('hide-me').toggleClass('show-me');
        $(this).find('.btn-delete').toggleClass('hide-me').toggleClass('show-me');
      });
    },500);
    this.getProject();
    this.getColleagues();
    this.getProfileData();
    this.postFollow();

    this.userTag.valueChanges.subscribe(val => {
      this.taggedUsers = val;
      
      this.userTagsList = [];
      this.api.getauthuser(this.taggedUsers).subscribe(x => {
        if (val != '') {
          var data = x['data']
          for (var i =0; i< data.length; i++) {
            this.userTagsList.push(data[i])
          }
        } else {
          this.userTagsList = [];
        }
      })
    });





  }

 getColleagues(){
   this.api.getColleaguesProfiles().subscribe( x =>{
     console.log(x['data'].colleague_accounts)
     this.colleagues = x['data'].colleague_accounts
   })  
 }
 country_code;
 mobile_number;

 getNumber(obj){
  var numb = this.colleagueForm.value.mobile_number.length
  this.country_code = obj.slice(0, -numb); 
  }

  telInputObject(obj) {
    console.log(obj);
    obj.setCountry('in');
  }
  
  hasError(obj){
    console.log(obj);
  }
  onCountryChange(obj){
    console.log(obj)
  }


  validateForm(){
    var username = this.colleagueForm.value.username
    var mobile_number= this.colleagueForm.value.mobile_number
    var email = this.colleagueForm.value.email
    var password = this.colleagueForm.value.password   
    var country_code = this.country_code

    if(username == ''){
      this.errormessage = "Please Enter Username"
      return false;
    }
    
    if(email == ''){
      this.errormessage = "Please Enter Email"
      return false;
    }

    // if(mobile_number == '' ){
    //   this.errormessage = "Please Enter Mobile number"
    //   return false;
    // }
    if(mobile_number.length !=  10 ){
      this.errormessage = 'Mobile number must be of 10 characters';
      return false;
    }

    if(password == ''){
      this.errormessage = "Please Enter Password"
      return false;
    }
    // if(country_code == ''){
    //   this.errormessage = "Please Enter Country code"
    //   return false;
    // }
    return true;
  }
  createColleague() {
    this.submitted = true;
    if(this.validateForm() == true){
  this.api.createColleaguesProfiles({
    username:this.colleagueForm.value.username,
    mobile_number: this.colleagueForm.value.mobile_number,
    email: this.colleagueForm.value.email,
    password: this.colleagueForm.value.password,   
    country_code: this.country_code
  }).subscribe(x =>{
    this.Toast.success('success', x['message'])
    console.log(x['message']);
    $('#add-colleague').modal('hide');
    setTimeout(()=>{
      window.location.reload();
    this.getColleagues();
    }, 500)
  },
  err =>{
    console.log(err.error.message)
    this.Toast.error('error', err.error.message)
  })
    }
}

getColleagueId(id){
  console.log(id)
  this.colleague_id = id;
}

deleteColleague(){
  this.api.deleteColleaguesProfiles({'id':this.colleague_id}).subscribe(x =>{
    this.Toast.success('Success', x['message'])
    $('#delete').modal('hide');
    setTimeout(()=>{
      window.location.reload();
    this.getColleagues();
    }, 500)
  }, err => {
    console.log(err);
  });
}
username = localStorage.getItem('userData') != undefined ? JSON.parse(localStorage.getItem('userData')).username : "";
socialLinks1
socialLinks2
socialLinks3
socialLinks4
showName
companyname
  getProfileData(){
    this.api.getProfileData(this.username).subscribe(d=>{
     
      this.profiledata=d['data']
      console.log(this.profiledata, "Profile Data")
      this.socialLinks1 = this.profiledata.social_links[1]
      
      if(this.profiledata.company_detail){
       
this.showName = this.profiledata.company_detail['name']
      } else{
        this.showName = this.profiledata.name
      }
      this.socialLinks2 = this.profiledata.social_links[2]
      this.socialLinks3 = this.profiledata.social_links[3]
      this.socialLinks4 = this.profiledata.social_links[4]
      console.log(this.username, "userName")
      if(this.profiledata.profile_type == 1)
        this.profiledata.profile_type = 'Personal'
      else if(this.profiledata.profile_type == 2)
        this.profiledata.profile_type = 'Company'
      else if(this.profiledata.profile_type == 2)
        this.profiledata.profile_type = 'Company colleague'

        this.companyname =  this.profiledata ?  this.profiledata.company_detail ? this.profiledata.company_detail['name']  : '' : ''
    }, err=>{
      console.log(err);
    });
  }
  openLink(data){
    
    console.log(data)
  window.open( 'https://' + data)
  }
 
  getProject(){
   
    this.api.getProjectData(this.username).subscribe(d=>{
      debugger
      this.projectdata = d['data']
      console.log(this.projectdata, "projectdata")
    }, err=>{
      console.log(err);
    })
  } 

  user_id = localStorage.getItem('userData') != undefined ? JSON.parse(localStorage.getItem('userData')).id : "";
  
  postFollow(){
    
    this.api.getfollowunfollow(this.user_id).subscribe(d=>{
      this.followdata = d['data']
      console.log(this.followdata);
      
      this.followdata.followed == true ? 1 : 0
    }, err=>{
      console.log(err);
    })
  }

  add2(event: MatChipInputEvent): void {
    
    const input = event.input;
    const value = event.value;

    if (input) {
      input.value = '';
    }
  }
  remove2(user): void {
    const index = this.userTaggs.indexOf(user);
    if (index >= 0) {
      this.userTaggs.splice(index, 1);
      if (this.userTagsList.includes(user.username)) {
        return;
      }
      else {
        this.userTagsList.push(user);
      }
    }
  }
  
  addUserTag(user) {
    debugger
    var userName = user.username
    let flag = false;
    for (var i = 0; i < this.userTaggs.length; i++) {
      if (this.userTaggs[i].username == userName) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }

    if (flag) {
      this.Toast.error("Tag already inserted")
    } else {
      this.userTaggs.push(user);
      var index = this.userTagsList.indexOf(user.username);
      if (index > -1) {
        this.userTagsList.splice(index, 1);
      }
    }
  }

     
 
  sendingtags:any = [];
    getTags(){
      
      for(var i of this.userTaggs){
        
        this.sendingtags.push(i.id)
        console.log(i,  this.sendingtags, "hhhhhh")
      }
    }
    inviteResponse
invite(){
  debugger
this.getTags()
// let a =  this.sendingtags.map((item)=>{
//  return item.toString()
// })
  const postData = new FormData();
  postData.append("user_id", this.sendingtags)
  
console.log(JSON.stringify(postData),"postData")
  this.api.inviteuser(postData).subscribe((a)=>{
this.inviteResponse = a['response']
    this.Toast.success("sucessfull")
    console.log(this.inviteResponse, "inviteResponse")
  }, error=>{
    this.Toast.error(error.error.message)
    console.log(error.error.message, "errorMessage")
  })
}

}
