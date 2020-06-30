import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {FormGroup , FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import {ApiService} from '../../service/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule, Routes , Router} from '@angular/router';
import { log } from 'util';
import { AngularFireDatabase } from '@angular/fire/database';



declare var iEdit: any;
declare var $:any;
declare var google;


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [ApiService,ToastrService]
})
export class FooterComponent implements OnInit {

//---------------------------DECLARATION CODE------------------------------
  gustregister : FormGroup;
  loginForm;
  otpverification;
  errormessage;
  bussiness_area=[];
  morethanfive:string = '0';
  profession=[]
  country_code=[];
  submitted : boolean = false;
  create_company_profile_page1 : FormGroup;
  create_company_profile_page2 : FormGroup;
  create_personal_profile_page1 : FormGroup;
  myFile : File;
  email;
  password;
  emp

  checked
  year_of_foundation;
  allYears = [];
  userData: any;
  userId: any;
  captured: boolean;
  
  constructor(protected fb : FormBuilder, 
    private ApiService: ApiService, 
    private af: AngularFireDatabase,
    private toast:ToastrService,
    private router:Router){

  }

  ngOnInit() {
    // this.userData = JSON.parse(localStorage.getItem('userData'));
    // this.userId = this.userData.id
    
    var d = new Date();
    var yyyy = d.getFullYear();
    for(var y = yyyy; y >= (yyyy - 50); y--){
    this.allYears.push(y)
    }
    console.log(this.allYears,"allYears")
    

    $('#moreEmp').click(function(){
      if(this.checked){
        this.morethanfive = '1';
      }else{
        this.morethanfive = '0';
      }
    })
    

    $('.toggle-footer').click(function(){
      $("#footish").slideToggle();
      $(".toggle-footer .fa").toggleClass("fa-angle-double-down").toggleClass("fa-angle-double-up");
    });

    $('.otp .otp-labl .otp1').keyup(function (e) {
      var key = e.which || e.keyCode || e.charCode;
      if (key == 8 || key == 46) {
        let is_first_child = $($(this).parent('.otp-labl')).is(':first-child');
        if (!is_first_child)
        $(this).parent('.otp-labl').prev('.otp-labl').children('.otp1').trigger("select");
        return;
      }
      $(this).parent('.otp-labl').next('.otp-labl').children('.otp1').trigger("select");
      if (String.fromCharCode(e.keyCode).match(/[^0-9]/g)) return false;
    });
//---------------------------INITIALIZATION CODE----------------------------


this.loginForm = this.fb.group({
  email: ['',[Validators.required]],
  password: ['',[Validators.required]]
});    

this.gustregister = this.fb.group({
      mobile_number: ['',[Validators.required,Validators.pattern("^[0-9]*$"),]],
      country_code: '',
      social_id:'',
      email:'',
    });
    this.otpverification={
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      orginal_verification_code: '',
    };
    this.errormessage='';
    this.submitted=false;
    this.create_company_profile_page1 = this.fb.group({
      username: '',
      company_name: '',
      email: '',
      password: '',
      confirm_password: '',
    });
    this.create_company_profile_page2 = this.fb.group({
      address_line1: '',
      address_line2: '',
      address_line3: '',
      description: '',
      bussiness_area: 'Select Business Area',

      year_of_foundation: 'Year Of Founding',      
      picture: null,      
    });

    // forget_pass_form(){
    //   this.forget_pass_form = this.fb.group({
    //     email: ['', [Validators.email, Validators.required]],
        
    //   });
    // } 

  // this.create_company_profile_page2.controls['year_of_founding'].setValue(document.getElementById('date-own'));
    this.create_personal_profile_pageform();
  
  }
  selectedFile: File

onFileChanged(event) {
  this.selectedFile = event.target.files[0]
}


moreEmp($event){
    if($event.target.checked){
    this.morethanfive = '1'  }
    else{this.morethanfive = '0'}
}
onUpload() {
  const uploadData = new FormData();
  uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
  // console.log(this.selectedFile.name+ "selected file")
  // console.log(uploadData+ "upload data")
}

create_personal_profile_pageform(){
  this.create_personal_profile_page1 = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
    name: ['', Validators.required],
    profession: ['Select Profession', Validators.required],
    picture: [null, Validators.required], 
       
  });
} 


  onSubmit(){
    debugger
    let datoToSend = {
      email: this.loginForm.get('email').value,
      password:this.loginForm.get('password').value,
      social_id:'',
      account_type:'1',
      device_type:'1',
      device_token:  "123"
      // localStorage.getItem("NToken")
     
     
      
    }
    // console.log(localStorage.getItem("NToken"), "nnn")
    this.ApiService.login(datoToSend).subscribe(
      response =>{
        this.toast.success("You are successfully logged in");
        localStorage.setItem("Notification",  'true')
        this.ApiService.setUserData(response.data)
        // localStorage.setItem("captured",response.captured)
        localStorage.setItem("captured", response.captured)
        
        
        setTimeout(function(){
          window.location.reload()
        },500)

        if(response.captured == false){
          
          this.router.navigate(['/subscription'])
          return
        } else{
          this.userState() 
        }
      },(error)=>{ 
        this.toast.error(error.error.message);
        
      }
    )
  }

  
//--------------------------LOADING CODE--------------------------------------
load_guest_number(){  
  this.submitted=false;   
  this.api_get_country_code();
  
  this.gustregister.setValue({
    mobile_number:'',
    country_code:'',
    social_id:'',
    email:'',
  });
  $("#guest-number").modal('show');

}

load_guest_otp(){
  this.otpverification.otp1 = '';
  this.otpverification.otp2 = '';
  this.otpverification.otp3 = '';
  this.otpverification.otp4 = '';            
}

load_create_company_profile_page1(){
  this.create_company_profile_page1.setValue({
    username: '',
    company_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
}

load_create_company_profile_page2(){
  this.api_get_bussiness_area()
  
}

getemp(){
  var a = $("#seloption :selected").val();
  if(a == 8){
    this.emp = 1
  }else{
    this.emp = 0
  }
  // console.log(a)
}
// getemp2(){
//   var c = document.getElementById('moreEmp')
//   console.log(c)
// }


load_create_personal_profile_page1(){
  //HERE******************
  this.create_personal_profile_pageform();
  this.api_get_profession()
}


// forget_pass(){


// }




//-------------------------VALIDATION CODE--------------------------------
validate_create_company_profile_page1(){  
  var username = this.create_company_profile_page1.value.username;
  var company_name = this.create_company_profile_page1.value.company_name;
  var email = this.create_company_profile_page1.value.email;
  var password = this.create_company_profile_page1.value.password;
  var confirm_password = this.create_company_profile_page1.value.confirm_password;  
  if(!username || username==""){
    this.loginError("Username can not be empty")
    return false
  }
  // if(/\d/.test(name)){
  //   this.errormessage = "Name can not contain numbers";
  //   return false;
  // }
  else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username)){
    // var regx = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g);
    // console.log(regx.test(name))
    this.loginError("Username can not contain special characters")
    return false;
  }
  else if(/\s/g.test(username)){
    this.loginError("Username can not contain space");
    return false;
  }
  if(!company_name || company_name==""){
    this.loginError("Company name can not be blank");
    return false;
  }
  else if(/\d/.test(company_name)){
    this.loginError("Company name can not have numbers");
    return false;
  }
  else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(company_name)){
    this.loginError("Company name can not have special characters");
    return false;
  }
  if(!email || email==""){
    this.loginError("email can not be blank");
    return false;
  }  
  else if (/[^@]+@[^\.]+\..+/.test(email)==false){
    this.loginError("email id is not valid");
    return false;
  }
  if(!password || password==""){
    this.loginError("Please provide password");
    return false;
  }
  else if(password.length<8){
    this.loginError("Password must have atleast 8 characters");
    return false;
  }
  if(!confirm_password || confirm_password==""){
    this.loginError("Please provide confirm password");
    return false;
  }
  else if(confirm_password.length<8){
    this.loginError("Confirm password must have atleast 8 characters");
    return false;
  }
  if(confirm_password!=password){
    this.loginError("Password and Confirm password not matching");
    return false;
  }
  return true;
}
Bussiness_Area
validate_create_company_profile_page2(){
  
  var address_line1 = this.create_company_profile_page2.value.address_line1;
  var address_line2 = this.create_company_profile_page2.value.address_line2;
  var address_line3 = this.create_company_profile_page2.value.address_line3;
  var description = this.create_company_profile_page2.value.description;
  var bussiness_area = this.create_company_profile_page2.value.bussiness_area;
this.Bussiness_Area = bussiness_area
  var year_of_foundation = this.create_company_profile_page2.value.year_of_foundation;
  console.log(year_of_foundation)
  var picture = this.selectedFile;
  if(!address_line1 || address_line1==""){
    this.loginError("Please provide address line1");
    $("#submitCheck").prop("checked",false);
    $("#btnCompanyProfileSubmit").prop("disabled",true);
    return false;
  }
 
  if(!bussiness_area || bussiness_area==""){
    this.loginError("Please provide bussiness area");
    $("#submitCheck").prop("checked",false);
    $("#btnCompanyProfileSubmit").prop("disabled",true);
    return false;
  }
  
  if(!year_of_foundation || year_of_foundation==""){
    this.loginError("Please provide year of foundation");
    $("#submitCheck").prop("checked",false);
    $("#btnCompanyProfileSubmit").prop("disabled",true);
    return false;
  }
  // console.log(picture)


  if(!$('#picCompany').val() || $('#picCompany').val()==null){
    this.loginError("Please provide picture");
    return false;
  }

  if(!$("#checkme1").is(":checked")){
    this.loginError("Please accept terms and conditions");
    return false;
  }

  return true;
}

// on image select

CheckUploadedImage(event){

    var file = event.target.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
     this.loginError("Whoops! That is not an image!");
     $('#createprofile').val('')
     $('#picCompany').val('')
     $('#previewPersonalImg').attr('src', '/assets/images/place_image.png')
  }else{
    var singleFiles = event.target.files;
    if (singleFiles) {
      for (let file of singleFiles) {
        let singleReader = new FileReader();
        singleReader.onload = (e: any) => {
          $('#previewPersonalImg').attr('src', e.target.result)
        }
        singleReader.readAsDataURL(file);
      }
    }


    this.selectedFile = file

  }
  
}

CheckUploadedImage2(event){

  var file = event.target.files[0];
  var fileType = file["type"];
  var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  if ($.inArray(fileType, validImageTypes) < 0) {
   this.loginError("Whoops! That is not an image!");
   $('#createprofile').val('')
   $('#picCompany').val('')
    $('#previewCompanyImg').attr('src', '/assets/images/place_image.png')
}else{
  var singleFiles = event.target.files;
  if (singleFiles) {
    for (let file of singleFiles) {
      let singleReader = new FileReader();
      singleReader.onload = (e: any) => {
        $('#previewCompanyImg').attr('src', e.target.result)
      }
      singleReader.readAsDataURL(file);
    }
  }


  this.selectedFile = file

}

}


validate_create_personal_profile_page1(){  
  var username = this.create_personal_profile_page1.value.username;  
  var email = this.create_personal_profile_page1.value.email;
  var password = this.create_personal_profile_page1.value.password;
  var confirm_password = this.create_personal_profile_page1.value.confirm_password;  
  var name = this.create_personal_profile_page1.value.name;
  var profession = this.create_personal_profile_page1.value.profession;
  var picture = this.selectedFile;
  this.email=email;
  this.password=password;


  if(!username || username==""){
    this.loginError("Username can not be empty")
    return false
  }    
  else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(username)){   
    this.loginError("Username can not contain special characters")
    return false;
  }
  else if(/\s/g.test(username)){
    this.loginError("Username can not contain space");
    return false;
  }  
  if(!email || email==""){
    this.loginError("email can not be blank");
    return false;
  }  
  else if (/[^@]+@[^\.]+\..+/.test(email)==false){
    this.loginError("email id is not valid");
    return false;
  }
  if(!password || password==""){
    this.loginError("Please provide password");
    return false;
  }
  else if(password.length<8){
    this.loginError("Password must have atleast 8 characters");
    return false;
  }
  if(!confirm_password || confirm_password==""){
    this.loginError("Please provide confirm password");
    return false;
  }
  else if(confirm_password.length<8){
    this.loginError("Confirm password must have atleast 8 characters");
    return false;
  }
  if(confirm_password!=password){
    this.loginError("Password and Confirm password not matching");
    return false;
  }
  if(!name || name==""){
    this.loginError("Name can not be blank");
    return false;
  }
  else if(/\d/.test(name)){
    this.loginError("Name can not have numbers");
    return false;
  }
  else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name)){
    this.loginError("Name can not have special characters");
    return false;
  }
  if(!profession || profession==""){
    this.loginError("Please provide profession");
    return false;
  }
  if(!$('#createprofile').val() || $('#createprofile').val()==null){
    this.loginError("Please provide picture");
    return false;
  }
  if(!$("#checkme2").is(":checked")){
    this.loginError("Please accept terms and conditions");
    return false;
  }

  return true;
}
//---------------------------------API CALLING CODE----------------------------------
  api_get_auto_detect_country_code(){    
      
  }
  api_get_country_code(){
    this.ApiService.get_country_code().subscribe(
      response => {          
        console.log(response.data);
        this.country_code = response.data;
        // Auto Detect country code-----------------------------------
        this.ApiService.auto_detect_country_code().subscribe(
          response2 => {          
            console.log(response2);                        
            response.data.forEach(element => {
            if(element.country_code==response2.countryCode){
                console.log(response2.countryCode,'sdasdad----------------');
                this.gustregister.patchValue({country_code: element.code}); 
              }
            });
          },
          error => {
            console.log('error',error);
            this.loginError(error.error.message);         
          }
        );          
        // response.data.forEach(element => {
          // if(element.country_code==countryCode){
          //   console.log(countryCode,'sdasdad----------------');
          //   this.gustregister.patchValue({country_code: countryCode}); 
          // }
        // });

        // this.gustregister.patchValue({country_code: '+49'});
      },
      error => {
        console.log('error',error);
        this.loginError(error.error.message);         
      }
    );
  }

  guest_register(){
    this.submitted=true; 
    if (this.gustregister.valid){
      console.log(this.gustregister)
      this.ApiService.guest_login(this.gustregister.value).subscribe(
        response => {

          
          // this.toast.success(response.message)         
          if(response.data.verification_code){
            this.load_guest_otp()
            this.otpverification.orginal_verification_code = response.data.verification_code          
            $("#guest-number").modal('hide');
            $("#guest-otp").modal('show');

            this.ApiService.setUserData(response.data)
 
            

          }
          else{
            if(response.data.is_num_verify && !response.data.is_profile_created){
              this.toast.success("OTP verified")
              
              $("#guest-number").modal('hide');
              $("#create_profile_link").removeClass('hide-me')
              $("#login_link").removeClass("show-me").addClass('hide-me')
              $("#gpsforlogin").modal('show');
              this.ApiService.setUserData(response.data)
 
            }
            else if(response.data.is_num_verify && response.data.is_profile_created){
              $("#guest-number").modal('hide');
              // $("#create_profile_link").removeClass('hide-me')
              this.toast.success("You are successfully logged in")
location.reload()
              $("#login_link").removeClass("show-me").addClass('hide-me')
              // $("#gps").modal('show');
              this.ApiService.setUserData(response.data)
  
            }
            
            this.loginError(response.message);
          }
        },
        error => {
          console.log('error',error)
          this.loginError(error.error.message);
        }
      );
    }
  }


  api_otp_verification(){
    var otp1 = this.otpverification.otp1;
    var otp2 = this.otpverification.otp2;
    var otp3 = this.otpverification.otp3;
    var otp4 = this.otpverification.otp4;
    var otp = otp1+otp2+otp3+otp4
    console.log(this.gustregister.value)
    var send_data={
      'country_code':this.gustregister.value.country_code,
      'mobile_number':this.gustregister.value.mobile_number,
      'verification_code':otp,
    }
    this.ApiService.otp_verify(send_data).subscribe(
      response => {          
          this.otpverification.otp1 = '';
          this.otpverification.otp2 = '';
          this.otpverification.otp3 = '';
          this.otpverification.otp4 = '';
          $("#create_profile_link").removeClass('hide-me')
          $("#login_link").removeClass("show-me").addClass('hide-me')
          $("#gpsforlogin").modal('show');
          $("#guest-otp").modal('hide');
          this.toast.success("You are successfully logged in");

      },
      error => {
        console.log('error',error)        
        this.loginError(error.error.message);
      }
    );
  }  




  api_get_bussiness_area(){
    this.ApiService.get_bussiness_area().subscribe(
      response => {
        console.log(response.data)
        this.bussiness_area = response.data;
      },
      error => {
        console.log('error',error)        
        this.loginError(error.error.message);         
      }
    );
  }


  api_get_profession(){
    this.ApiService.get_profession().subscribe(
      response => {
        console.log(response.data)
        this.profession = response.data;
      },
      error => {
        console.log('error',error)        
        this.loginError(error.error.message);         
      }
    );
  }

  

  api_create_company_profile(){
    debugger
    const data = new FormData();
    data.append('username',this.create_company_profile_page1.value.username),
    data.append('name',''),
    data.append('email',this.create_company_profile_page1.value.email),
    data.append('password',this.create_company_profile_page1.value.password),
    data.append('country_code',this.ApiService.getUserData().country_code),
    data.append('mobile_number',this.ApiService.getUserData().mobile_number),
    data.append('profession',''),
    data.append('profile_image',this.selectedFile),
    data.append('account_type','1'),
    data.append('profile_type','2'),
    data.append('social_id',''),
    data.append('device_token','temporary_device_token'),
    data.append('device_type','1'),
    data.append('company_name',this.create_company_profile_page1.value.company_name),
    data.append('address_line1',this.create_company_profile_page2.value.address_line1),
    data.append('address_line2',this.create_company_profile_page2.value.address_line2),
    data.append('address_line3',this.create_company_profile_page2.value.address_line3),
    data.append('description',this.create_company_profile_page2.value.description),
    data.append('bussiness_area',this.create_company_profile_page2.value.bussiness_area),
    data.append('is_more_than_5', this.morethanfive),
    data.append('year_of_foundation',this.create_company_profile_page2.value.year_of_foundation),
    data.append('lat', this.lat_toSend),
    data.append('lon', this.lon_toSend)
  
    // console.log(this.create_company_profile_page2.value.picture)
    this.ApiService.postCreateProfile(data).subscribe(
      response => {                  
        console.log(response)

        this.ApiService.setUserData(response.data)
        this.toast.success('success',response.message)
        if(this.Bussiness_Area == "1" || this.Bussiness_Area == "2" || this.Bussiness_Area == "6" || this.Bussiness_Area == "4" ){
          this.router.navigate(['/home'])
        
       
          this.userState()
        }
        else{
          this.router.navigate(['/subscription'])
        }
       

       
        setTimeout(function(){
          location.reload()
        },1500)
        
        $("#company-profile-page2").modal('hide');
      },
      error => {
        console.log('error',error)
        this.toast.error(error.error.message)        
        this.loginError(error.error.message);         
      }
      );
//       data.get('year_of_foundation')
// console.log(this.year_of_founding)
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
  lat_toSend;
  lon_toSend;
  api_get_address_from_lat_long(lat,long){
    // console.log(lat);
    // console.log(long);
    this.lat_toSend = lat;
    this.lon_toSend = long;
    this.ApiService.getAddressFromLatLng(lat+','+long).then(
      result => { 
        var locations = <Array<any>>result;        
        console.log(result) 
        // console.log(locations[0].Location.Address)        
        // this.address_line1 = locations[0].Location.Address.Street+','+locations[0].Location.Address.District;
        // this.address_line2 = locations[0].Location.Address.City+','+locations[0].Location.Address.State;
        // this.address_line3 = locations[0].Location.Address.Country+','+locations[0].Location.Address.PostalCode;
        this.create_company_profile_page2.controls['address_line1'].setValue(
          locations[0].Location.Address.Label
        );
        // this.create_company_profile_page2.controls['address_line2'].setValue(
        //   locations[0].Location.Address.District + ', '+locations[0].Location.Address.City+','+locations[0].Location.Address.State
        // );
        // this.create_company_profile_page2.controls['address_line3'].setValue(
        //   locations[0].Location.Address.PostalCode + ', '+ locations[0].Location.Address.Country
        // );
      },
      error => {
        console.log('error',error)
        // this.loginError(error.error.message);
      }
    );
  }
  api_create_personal_profile(){
    // *********************
    // console.log(this.create_personal_profile_page1.value.password);
    // console.log(this.create_personal_profile_page1.value.conf_password);
    const data = new FormData();
    data.append('username',this.create_personal_profile_page1.value.username),
    data.append('name',this.create_personal_profile_page1.value.name),
    data.append('email',this.email),
    data.append('password',this.password),
    data.append('country_code',this.ApiService.getUserData().country_code),
    data.append('mobile_number',this.ApiService.getUserData().mobile_number),
    data.append('profession',this.create_personal_profile_page1.value.profession),
    data.append('profile_image', this.selectedFile, this.selectedFile.name);
    // data.append('profile_image',this.create_personal_profile_page1.value.picture),
    data.append('account_type','1'),
    data.append('profile_type','1'),
    data.append('social_id',''),
    data.append('device_token','sample'),
    data.append('device_type','1'),
    data.append('company_name',''),
    data.append('address_line1',''),
    data.append ('address_line2',''),
    data.append ('address_line3',''),
    data.append ('description',''),
    data.append ('bussiness_area',''),
    data.append ('year_of_foundation',''),
    data.append('lat', ''),
    data.append('lon', '')
    
    console.log(data)
    this.ApiService.postCreateProfile(data).subscribe(
      response => {
        console.log(response)
        this.toast.success(response.message)
        
        this.ApiService.setUserData(response.data)
        
        setTimeout(function(){
          location.reload()
        },1000)
       
        localStorage.setItem("captured", 'true')
        $("#individual-profile").modal('hide');
        $("#login_link").removeClass("show-me").addClass('hide-me')
      },
      error => {
        console.log('error',error)
        this.toast.error(error.error.message)        
        // this.loginError(error.error.message);         
      }
    );
  }
//-------------------------OPERATION PERFORM CODE--------------------------
  

// google.maps.event.addListener(this.post_marker, 'dragend', function() 
//     {
//         console.log( this.getPosition().lat(), this.getPosition().lng())
//         $('#map-lat').val(this.getPosition().lat())
//         $('#map-lon').val(this.getPosition().lng())
//     });



GetAddressEvent(){
  
  $('#custom_location').html('')
    window.navigator.geolocation.getCurrentPosition(data=> {
      
      console.log(data);
      // var lat = data.coords.latitude
      // var long = data.coords.longitude
      
      var lat = $('#map-lat').val()
      var long  = $('#map-lon').val()

      if (lat && long){
       
        console.log(lat);
        console.log(long);
        this.api_get_address_from_lat_long(lat,long);
 
      }else{
        
        console.log('no lat long found')
        $("#gps").modal('show');      
        this.loginError('Unable to access your location');

        window.location.reload()
      }
    });

}


  getCurrentLocation(){
    $('#custom_location').html('')
    window.navigator.geolocation.getCurrentPosition(data=> {
      console.log(data);
      var lat = data.coords.latitude
      var long = data.coords.longitude
      if (lat && long){
        console.log(lat);
        console.log(long);
        this.api_get_address_from_lat_long(lat,long);
 
      }else{
        console.log('no lat long found')
        $("#gps").modal('show');      
        this.loginError('Unable to access your location');
      }
    });
  }


  getCurrentLocationForLogin(){

    $('#custom_location').html('')
    window.navigator.geolocation.getCurrentPosition(data=> {
      
      console.log(data);
      var lat = data.coords.latitude
      var long = data.coords.longitude
      if (lat && long){
        
        console.log(lat);
        console.log(long);
        this.api_get_address_from_lat_long(lat,long);
        console.log("Function");
       setTimeout(() => {
         console.log("Reload");
         
        location.reload(true)
       }, 500);
         
        

      }else{
        console.log("Else");
          location.reload()
      }
    });
    location.reload()

  }




  deniedLocation(){

      location.reload()
  }

  checkGPSStatus(){
    this.ApiService.getCurrentLocation().then(
      data=> {
        console.log(data);
        $('#location').modal('show')
      },
      error=> {
        console.log(error);
        this.toast.error("Unable to access your current location Because you blocked it. Please set marker manually to current location");
        // $('#location').modal('show')
        
      }
    )

  }

  resend_otp(){
    $("#guest-number").modal('show');
    $("#guest-otp").modal('hide');
  }
  open_create_company_profile_page1(){
    $("#create-profile").modal('hide');
    this.load_create_company_profile_page1();
    $("#company-profile-page1").modal('show');
  }
  submit_create_company_profile_page1(){
    if(this.validate_create_company_profile_page1()){
      console.log('hello')
      $("#company-profile-page2").modal('show');
      this.load_create_company_profile_page2();
      $("#company-profile-page1").modal('hide');
      $("#imagefile").src="";
    }   
  }
  submit_create_company_profile_page2(){
    if(this.validate_create_company_profile_page2()){
      this.api_create_company_profile();
      this.create_company_profile_page2.setValue({
        address_line1: '',
        address_line2: '',
        address_line3: '',
        description: '',
        bussiness_area: '',
        year_of_foundation: '',    
        picture: null,    
      });
    }
  }
  open_create_personal_profile_page1(){
    $("#create-profile").modal('hide');
    this.load_create_personal_profile_page1();
    $("#individual-profile").modal('show');
    $("#imagefile2").src="";
  }

  submit_create_personal_profile_page1(){


   
    
    if(this.validate_create_personal_profile_page1()){
      this.api_create_personal_profile();
    }
  }

//-------------------------------API ERROR HANDLING CODE---------------------------------  
  loginError(e) {
    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }
  

}



