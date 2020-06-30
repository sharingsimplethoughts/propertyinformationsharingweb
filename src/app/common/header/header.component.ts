import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../service/api/api.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

// declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogined=false;
  isProfileCreated=false;
  username;
  userId: any;
  userData: any;
  constructor(
    private ApiService: ApiService,
    private toast:ToastrService,
    private router:Router,
    private af: AngularFireDatabase,
  ) { }
  profile_type
  captured
  ngOnInit() {
    
    if(this.ApiService.checkIsLogin()){
      this.isLogined =true

      console.log(this.ApiService.getUserData().username)
      if(this.ApiService.getUserData().username ===undefined){
        this.username = 'Guest'
      }else{
        this.username = this.ApiService.getUserData().username

      }
      this.isProfileCreated = this.ApiService.getUserData().is_profile_created
    }
this.captured = localStorage.getItem("captured")
console.log(this.captured, "hh");

    this.profile_type = this.ApiService.getUserData() ? this.ApiService.getUserData().profile_type :  ''
   
    
  }
searchList
  searchPost(){
    let ss
    this.ApiService.searchPost(ss).subscribe((res)=>{
this.searchList = res['data']
    })
  }

  ifSubscribe(){
    debugger
   
      if(this.captured == 'true'){
        this.router.navigate(['/home'])
      }
     
     else{
      this.router.navigate(['/subscription'])
    }
  }

  logout(){
debugger
this.userData = JSON.parse(localStorage.getItem('userData'));
    this.userId = this.userData.id

    this.ApiService.getlogout().subscribe(res=>{

      this.ApiService.logout();
      this.isLogined=false;
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      localStorage.removeItem('Ntoken')
      localStorage.removeItem("captured")
      localStorage.removeItem("Notification")
      this.toast.success("success", "Logout Successfully")
      
      let  timestamp = new Date().getTime().toString()
      
      let dataTosaveRecent = {
        id: this.userId,
        name: this.userData.company_detail['name'],
        profile_image:this.userData.company_detail['picture'],
        onlineState:"0",
        timeStamp:timestamp,
       
    }
    this.af.database.ref('/userState/' + this.userId.toString()).set(dataTosaveRecent)

      setTimeout(()=>{
        this.router.navigate(['/'])
      },200)

    },err=>{

      this.isLogined=false;
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('userData')
      this.toast.success("success", "Logout Successfully")
      
      setTimeout(()=>{
        this.router.navigate(['/'])
      },200)
      
    })

  }


  goToProfile(){
    debugger
    if(this.isProfileCreated==false){
      this.toast.error("Create your Profile")
      this.router.navigate[('/home')]
    } else{
      this.router.navigate(['/my-profile'])
    }
  }
  searching=false;
  search(){
  return this.searching=true;
  
  }

}
