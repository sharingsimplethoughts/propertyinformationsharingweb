import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
declare var $:any;


@Component({
  selector: 'app-unfollowed-profile',
  templateUrl: './unfollowed-profile.component.html',
  styleUrls: ['./unfollowed-profile.component.css']
})
export class UnfollowedProfileComponent implements OnInit {
  profiledata: any;
  projectdata: any;
  userName
  socialLinks1: any;
  socialLinks2: any;
  socialLinks3: any;
  socialLinks4: any;

  constructor(
    private api:ApiService, 
    private Toast:ToastrService,
    private activatedRoute: ActivatedRoute
    ) { }
    profile_type
  ngOnInit() {

    this.activatedRoute.params.subscribe(data => {
      this.userName = data['name'];
      console.log(this.userName);
      
    })

    this.getProject();
    this.getProfileData()

    this.activatedRoute.params.subscribe(data => {
      this.userName = data['name'];
      console.log(this.userName);
      
    })


    this.profile_type = this.api.getUserData().profile_type
    

  }

  // username = localStorage.getItem('userData') != undefined ? JSON.parse(localStorage.getItem('userData')).username : "";
id
  getProfileData(){
    this.api.getProfileData(this.userName).subscribe(d=>{
      console.log(d, "UserProfileData")
      this.profiledata=d['data']
      console.log(this.profiledata, "ProfileData");
      this.id = this.profiledata.id
      if(this.profiledata.profile_type == 1)
        this.profiledata.profile_type = 'Personal'
      else if(this.profiledata.profile_type == 2)
        this.profiledata.profile_type = 'Company'
      else if(this.profiledata.profile_type == 2)
        this.profiledata.profile_type = 'Company colleague'
        this.socialLinks1 = this.profiledata.social_links[1]
        this.socialLinks2 = this.profiledata.social_links[2]
      this.socialLinks3 = this.profiledata.social_links[3]
      this.socialLinks4 = this.profiledata.social_links[4]
    }, err=>{
      console.log(err);
    });
  }


  openLink(data){
    debugger
    console.log(data)
    if(data){
  window.open( 'https://' + data)
    }
  }

  getProject(){
    debugger
    this.api.getProjectData(this.userName).subscribe(d=>{
      this.projectdata=d['data']
      // console.log(this.projectdata)
    }, err=>{
      console.log(err);
    })
  }
 userId
 followed: any
  followUnfollow(){
    debugger
    this.userId = this.profiledata.id
    let dataTosend = {
      user_id: this.userId
    }
    this.api.followunfollowUser(dataTosend).subscribe((res)=>{
      debugger
      this.followed = res['followed']
      console.log(this.followed, "truOrFalse")
      if( this.followed == "True"){
        debugger
        $('#follow').modal('show')
        setTimeout(() => {
          $('#follow').modal('hide')
        },1000 );
      } else{
        $('#Unfollow').modal('show')
        setTimeout(() => {
          $('#Unfollow').modal('hide')
        },1000 );

      }
      this.getProfileData()

      //  this.followed == true ? $('#follow').modal('show') : $('#Unfollow').modal('show')
    }, error=>{
      this.Toast.error(error.error.message)
    })
  }
likes
likeDIslike(){
  debugger
  this.userId = this.profiledata.id
  let dataTosend = {
    user_id: this.userId
  }
  this.api.likedislike(dataTosend).subscribe((res)=>{
this.likes = res['message']
this.Toast.success(this.likes)
this.getProfileData()
console.log(this.likes, "likes")
  }, error =>{
    this.Toast.error(error.error.message)
  })
}

}
