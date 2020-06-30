import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormBuilder, Validators, } from '@angular/forms';
import { ApiService } from '../../service/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service'
import { MessagingService } from "../../service/messaging.service";



export interface Taggs {
  name: string;
}

declare var $: any;
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ApiService, ToastrService]
})
export class HomeComponent implements OnInit {

  map: any;
  infowindow;
  recentPosts: any = [];
  QuestCreateForm: FormGroup;
  singleFiles;
  isImage = false;
  isDescription = false;
  isNickname = false;
  formData: any;
  postForm: FormGroup;
  errormessage;
  project_typeData: any = [];
  project_categoryData: any = [];
  markersArray = [];
  postImage;
  postImageTag = "Enter Credit";
  otherOption = false;
  typ;
  hideCat;
  starType;
  strD;
  endD;
  latitude;
  longitude;
  address;
  fullAddress;
  city;
  country;
  posttalcode;
  street;
  posts;
  business_pins;
  questionPosts;
  createPostMap;
  post_marker;
  create_company_profile;
  post_marker2;
  current_lat;
  current_long;
  current_postion;
  message;
  taggedUsers;
  
  new_tag = new FormControl('');
  userTag = new FormControl('');
  
  d: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsList = [];
  taggs: Taggs[] = [];
  userTagsList = [];
  userTaggs :any = [];
  
  project_typeList
  categoryList
  countryList 
  selectedProjecttypeFilter :String =''
  selectedCategoryFilter :String =''
  selectedCountryFilter :String =''
  FilterYear = new FormControl('');
  FilterYear_mobile = new FormControl('');
  FilterCity_zip = new FormControl('');
  FilterCity_zip_mobile = new FormControl('');
  filterMaterial = new FormControl('');
  filterMaterial_mobile = new FormControl('');
  
  filterElement = new FormControl('');
  filterElement_mobile = new FormControl('');

  countrylist = new FormControl('Select Country')
  projectTypefilter = new FormControl('Select Project Type')
  categoryfilter = new FormControl('Select Category')
  selectedYearFilter: String = ''
  selectedCity_zip: String = ''
  selectedMaterialFilter: String = ''
  selectedElementFilter: String = ''
 
  constructor(
    protected fb: FormBuilder,
    private ApiService: ApiService,
    private toast: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router:Router,
    private auth: AuthService,
    private messagingService: MessagingService
  ) {}

  ngOnInit() {

   
      this.infowindow =  new google.maps.InfoWindow({
        content: ""
      });

    this.resetFilter();
    // window.location.reload()

    if (navigator.geolocation) {
      // Call getCurrentPosition with success and failure callbacks
      window.navigator.geolocation.getCurrentPosition(data => {

        this.current_lat = data.coords.latitude
        this.current_long = data.coords.longitude
localStorage.setItem("lat",  this.current_lat)
localStorage.setItem("long",  this.current_long )
        console.log(`lat  - ${this.current_lat}, long - ${ this.current_long}`);
        

      })
    }
    else {
      alert("Sorry, your browser does not support geolocation services.");
    }
    

    let userData =  JSON.parse(localStorage.getItem('userData'))
    console.log(userData, "userData Home");
    debugger
    let userId = userData ? userData['id'] : '123'
    
      setTimeout(() => {
        debugger
        this.messagingService.requestPermission(userId)
        this.messagingService.receiveMessage()
        this.message = this.messagingService.currentMessage
      }, 5000);

    

    var imagesPreview = function (input, placeToInsertImagePreview) {
      if (input.files) {
        var filesAmount = input.files.length;
        var i;
        for (i = 0; i < filesAmount; i++) {
          var reader: any,
            target: EventTarget;
          reader = new FileReader();
          reader.onload = function (event) {
            var html = $('<li class="marks"><a href="JavaScript:void(0);" data-toggle="modal" data-target="#my-pic"><img src=' + event.target.result + '></a><button class="remove-pic">&#10006;</button><input class="credit-field" id="creditt" type="text" placeholder="Enter Credit"/></li>');
            $(html).appendTo(placeToInsertImagePreview);
            $('.remove-pic').click(function () {
              $(this).closest('li').remove();
            });
          }
          reader.readAsDataURL(input.files[i]);
          $('#myimg').val(reader)
        }
      }

    };

    for (var i = new Date().getFullYear(); i > 1900; i--) {
      $('#yearpicker').append($('<option />').val(i).html(i));
    }

    // $('#multiImageSelet').on('change', function () {
    //   imagesPreview(this, 'ul.pictures');
    // });


    this.QuestCreateForm = this.fb.group({
      nickName: [''],
      description: ['', [Validators.required]],
    });

    this.postForm = this.fb.group({
      name: '',
      project_type: 'Select Project Type',
      project_category: 'Select Project Category',
      year: '',
      t_type_start_date: '',
      t_type_end_date: '',
      tags: '',
      about_post: '',
      images: null,
    });
    // hit api on every single input on enter tags
    this.new_tag.valueChanges.subscribe(val => {
      this.message = val;
      this.tagsList = [];
      this.ApiService.getTagsList(this.message).subscribe(x => {
        if (val != '') {
          var data = x['data']
          console.log(data)
          for (var i =0; i < data.length; i++) {
            this.d = data[i].tag
            this.tagsList.push(this.d)
          }
        } else {
          this.tagsList = [];
        }
      })
    });

     // hit api on every single input on enter User Tags
     this.userTag.valueChanges.subscribe(val => {
      this.taggedUsers = val;
      
      this.userTagsList = [];
      this.ApiService.getUserTagList(this.taggedUsers).subscribe(x => {
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

    // hit api on filter year
    this.FilterYear.valueChanges.subscribe(val => {
      this.selectedYearFilter = val;
      if(this.selectedYearFilter.length == 4){
        this.getHomePagedata();
      }
    });

    this.FilterYear_mobile.valueChanges.subscribe(val => {
      this.selectedYearFilter = val;
      if(this.selectedYearFilter.length == 4){
        this.getHomePagedata();
      }
    });

    // filter material
    this.filterMaterial.valueChanges.subscribe(val => {
      this.selectedMaterialFilter = val;
      if(this.selectedMaterialFilter.length > 3){
        this.getHomePagedata();
      }
    });

    this.filterMaterial_mobile.valueChanges.subscribe(val => {
      this.selectedMaterialFilter = val;
      if(this.selectedMaterialFilter.length > 3){
        this.getHomePagedata();
      }
    });

    // filter material
    this.filterElement.valueChanges.subscribe(val => {
      this.selectedElementFilter = val;
      if(this.selectedElementFilter.length > 3 ){
        this.getHomePagedata();
      }
    });

    this.filterElement_mobile.valueChanges.subscribe(val => {
      this.selectedElementFilter = val;
      if(this.selectedElementFilter.length > 3){
        this.getHomePagedata();
      }
    });

    this.FilterCity_zip.valueChanges.subscribe(val => {
      this.selectedCity_zip = val;
      if(this.selectedCity_zip.length > 4){
        this.getHomePagedata();
      }
      
    });

    this.FilterCity_zip_mobile.valueChanges.subscribe(val => {
      this.selectedCity_zip = val;
      if(this.selectedCity_zip.length > 4){
        this.getHomePagedata();
      }
      
    });


    $('#filter-mob').click(function () {
      $('.hide-show-me').slideToggle();
      $('.change-me').toggleClass('col-md-12').toggleClass('col-md-8').toggleClass('col-lg-12').toggleClass('col-lg-2').toggleClass('offset-md-4');
    });
    $('#crt-post').click(function () {
      if (localStorage.getItem('userData')) {
        $("#involvement").modal('show');
        $("#post").modal('hide');
      } else {
        $("#create-profile").modal('show');
        $("#post").modal('hide');
      }
    });

    $('.mapClose').click(function () {
      $('.mapBox').removeClass('slide-left');
      if ($('.filters-col').hasClass('full-width')) {
        $('.filters-col').addClass('full-width');
      } else {
        $('.filters-col').removeClass('full-width');
      }
    });
    $('.mapOpen').click(function () {
      $('.mapBox').addClass('slide-left');
      $('.filters-col').addClass('full-width');
    });

    $('.filter-desktop').click(function () {
      $('.filters-col').toggleClass('full-width');
      if ($('.filters-col').hasClass('full-width')) {
        $(this).closest('.filters-col').find('.col:not(:first-child)').removeClass('hide-this');
      } else {
        $(this).closest('.filters-col').find('.col:not(:first-child)').addClass('hide-this');
      }

    });
    
   
    this.load_create_posts()

    // get home page data
    // this.getHomePagedata();

    setTimeout(()=>{
      this.getFilterListData();
    }, 3000)


  }

  // save tags on click save button
  saveTag() {
    $('#mtChip').value = "";
  }

  // add tag on select from list
  addTag(event) {
    var tagName = event.target.textContent
    let flag = false;
    for (var i = 0; i < this.taggs.length; i++) {
      if (this.taggs[i].name == tagName) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }

    if (flag) {
      this.toast.error("Tag already inserted")
    } else {
      this.taggs.push({ name: tagName });
      var index = this.tagsList.indexOf(event.target.textContent);
      if (index > -1) {
        this.tagsList.splice(index, 1);
      }
    }
  }
  // add tag on hit enter

  onEnter() {
    let flag = false;
    if ((this.message.length > 3 && this.message != '')) {

    for (var i = 0; i < this.taggs.length; i++) {
      if (this.taggs[i].name == this.message) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }

    if (flag) {
      this.toast.error("Tag already inserted")
    } else {
      this.taggs.push({ name: this.message });
      this.new_tag.setValue('');
    }
    }
  }

  // mat chip 

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // if ((value || '').trim()) {
    //   this.taggs.push({name: value.trim()});
    // }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tagg: Taggs): void {
    const index = this.taggs.indexOf(tagg);
    if (index >= 0) {
      this.taggs.splice(index, 1);
      if (this.tagsList.includes(tagg.name)) {
        return;
      }
      else {
        this.tagsList.push(tagg.name);
      }
    }
  }

  // mat chip end

  // add user tag on select from list
  
  addUserTag(user) {
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
      this.toast.error("Tag already inserted")
    } else {
      this.userTaggs.push(user);
      var index = this.userTagsList.indexOf(user.username);
      if (index > -1) {
        this.userTagsList.splice(index, 1);
      }
    }
  }
  // add tag on hit enter

  // onEnter2() {
  //   let flag = false;
  //   if ((this.taggedUsers.length > 3 && this.taggedUsers != '')) {

  //   for (var i = 0; i < this.userTaggs.length; i++) {
  //     if (this.userTaggs[i].name == this.taggedUsers) {
  //       flag = true;
  //       break;
  //     } else {
  //       flag = false;
  //     }
  //   }

  //   if (flag) {
  //     this.toast.error("Tag already inserted")
  //   } else {
  //     this.userTaggs.push({ name: this.taggedUsers });
  //     this.userTag.setValue('');
  //   }
  //   }
  // }

  // mat chip 

  add2(event: MatChipInputEvent): void {
    debugger
    const input = event.input;
    const value = event.value;

    // if ((value || '').trim()) {
    //   this.taggs.push({name: value.trim()});
    // }

    // Reset the input value
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

  // mat chip end

  selectedImages: any = [];
  base64Image: any = [];
  chooseImage(event) {
    var that = this;
    this.otherOption = true;
    for (let i = 0; i < event.target.files.length; i++) {
      let img = event.target.files[i];
      const reader = new FileReader();
      reader.onload = function () {
        that.base64Image.push(reader.result);
      };
      reader.readAsDataURL(img);
      this.selectedImages.push(img);
    }
    // let file = event.target.files[0];
    // var that = this;
    // const reader = new FileReader();
    // reader.onload = function() {
    //   that.base64Image.push(reader.result); 
    // };
    // reader.readAsDataURL(event.target.files[0]);
    // this.selectedImages.push(event.target.files[0]);
  }

  imageTags:any = [];

  getImageTag(){
  for(var i =0;i < this.base64Image.length; i++){
    this.imageTags.push($('#imgTag' + i).val())
  }
  // console.log(this.imageTags)
  }

  removeImage(image, index) {
    this.base64Image.splice(index, 1);
    this.imageTags.splice(index, 1);
    this.selectedImages.splice(index, 1);
    if (this.selectedImages.length == 1) {
      this.otherOption = true;
      // console.log(this.selectedImages.length)
    }
  }
    
  getCountryFilter(event){
    this.selectedCountryFilter  = event.target.value;
    console.log(this.selectedCountryFilter)
    this.getHomePagedata();
  }

  getProjecttypeFilter(event){
    this.selectedProjecttypeFilter  = event.target.value;
    // console.log(this.selectedProjecttypeFilter)
    this.getHomePagedata();
  }

  getCategoryFilter(event){
    this.selectedCategoryFilter  = event.target.value;
    // console.log(this.selectedCategoryFilter)
    this.getHomePagedata();
  }

  // filterResponse
  // filterApi(){
  //   let datToSend = {
  //     country:   this.selectedCountryFilter,
  //     city_or_zipcode: '',
  //     project_type:  this.selectedProjecttypeFilter ,
  //     project_category:  this.selectedCategoryFilter,
  //     year:  this.selectedYearFilter,
  //     material: '',
  //     element : '',
  //     sort_projects: '',
  //     filter_projects: ''
  //   }

  //   this.ApiService.filterHomePgae(datToSend).subscribe((res)=>{
  //     this.filterResponse = res['data']
  //   })
  // }
  favoriteList = 'false'
  favoritePost(){
    debugger
    this.favoriteList = 'true'
   
    this.getHomePagedata()
  }

  allPost(){
    this.favoriteList = 'false'
    this.getHomePagedata()
  }
  
  resetFilter(){
    this.FilterYear.patchValue('')
    this.FilterCity_zip.patchValue('')
    this.FilterYear_mobile.patchValue('')
    this.FilterCity_zip_mobile.patchValue('')

    this.filterMaterial.patchValue('')
    this.filterMaterial_mobile.patchValue('')
    this.filterElement.patchValue('')
    this.filterElement_mobile.patchValue('')

    this.countrylist.patchValue('Select Country')
    this.projectTypefilter.patchValue('Select Project Type')
    this.categoryfilter.patchValue('Select Category')

    this.selectedCity_zip = ''
    this.selectedYearFilter = '' 
    this.selectedMaterialFilter = ''
    this.selectedElementFilter = ''
    this.selectedCountryFilter = ''
    this.selectedProjecttypeFilter = ''
    this.selectedCategoryFilter = ''
    this.getHomePagedata();
  }

  getHomePagedata() {
    debugger
    $('#togglemap').removeAttr('checked');
    this.clearQuestionFromMap()
    if (this.auth.isLoggedIn())
    
{
  this.ApiService.getHomePageData({
    country:this.selectedCountryFilter,
    city_or_zipcode:this.selectedCity_zip,
    project_type:this.selectedProjecttypeFilter,
    project_category:this.selectedCategoryFilter,
    year:this.selectedYearFilter,
    material:this.selectedMaterialFilter,
    element:this.selectedElementFilter,
    sort_projects:  this.favoriteList
    
  }).subscribe(
    (response: any) => {
      console.log(response)
      this.recentPosts = response['data'].latest_post;
      console.log(this.recentPosts)
      this.posts = response.data.posts
      this.business_pins = response.data.business_pins
      this.questionPosts = response.data.questions;
      
      // console.log(lon +"filter location")
      if(this.selectedCountryFilter != ''){
        this.initMap(5)
      }else{
        this.initMap('');
      }
      setTimeout(()=>{
         
        if(this.selectedCountryFilter != ''){
          var lat = this.posts[0].lat
            var lon = this.posts[0].lon
            var filterLocation = new google.maps.LatLng(lat, lon);
            // console.log(filterLocation)
            this.map.setCenter(filterLocation);       
       }
            
      },500)
            
    }
  )
} else{
  this.ApiService.getHomePageDataa({
    country:this.selectedCountryFilter,
    city_or_zipcode:this.selectedCity_zip,
    project_type:this.selectedProjecttypeFilter,
    project_category:this.selectedCategoryFilter,
    year:this.selectedYearFilter,
    material:this.selectedMaterialFilter,
    element:this.selectedElementFilter,
    
    
  }).subscribe(
    (response: any) => {
      console.log(response)
      this.recentPosts = response['data'].latest_post;
      console.log(this.recentPosts)
      this.posts = response.data.posts
      this.business_pins = response.data.business_pins
      this.questionPosts = response.data.questions;
      
      // console.log(lon +"filter location")
      if(this.selectedCountryFilter != ''){
        this.initMap(5)
      }else{
        this.initMap('');
      }
      setTimeout(()=>{
         
        if(this.selectedCountryFilter != ''){
          var lat = this.posts[0].lat
            var lon = this.posts[0].lon
            var filterLocation = new google.maps.LatLng(lat, lon);
            // console.log(filterLocation)
            this.map.setCenter(filterLocation);       
       }
            
      },500)
            
    }
  )

}

    
  }

  
  
  getFilterListData(){
    this.ApiService.getFilterListData().subscribe(x=>{
      var data = x['data']
        // console.log(data)
      this.project_typeList = data.project_type
      this.categoryList = data.category
      this.countryList = data.country

    })
  }



  stylez = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]

  getBusinessflag(type){
    var baseIcon = '/assets/images/icon_web/'

    if (type == 2) {
      return baseIcon + 'business_free.png';

    }else if (type == 3) {
      return baseIcon + 'business_basic.png';

    }else if (type == 4) {
      return baseIcon + 'business_premium.png';

    }else if (type == 5) {
      return baseIcon + 'business_premium.png';

    }
  }

  getflag(type, cat) {

    var baseIcon = '/assets/images/icon_web/'

    if (type == "Refurbishment" && cat == "Agricultural") {
      return baseIcon + 'agricultural_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Civic") {
      return baseIcon + 'civic_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Educational") {
      return baseIcon + 'education_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Government") {
      return baseIcon + 'government_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Health & Care") {
      return baseIcon + 'health_care_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Hotel") {
      return baseIcon + 'hotel_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Industrial") {
      return baseIcon + 'industrial_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Military") {
      return baseIcon + 'military_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Multi Purpose") {
      return baseIcon + 'multi_purpose_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Office") {
      return baseIcon + 'office_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Religious") {
      return baseIcon + 'religious_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Residential") {
      return baseIcon + 'residential_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Retail") {
      return baseIcon + 'retail_refurbishment.png';

    }else if (type == "Refurbishment" && cat == "Special purpose") {
      return baseIcon + 'special_purpose_refurbishment.png';

    }else if (type == 'Refurbishment' && cat == 'Transport') {
      return baseIcon + 'transport_refurbishment.png';

    }


     else if (type == 'Extension' && cat == 'Transport') {
      return baseIcon + 'transport_extension.png';

    }else if (type == 'Extension' && cat == 'Special purpose') {
      return baseIcon + 'special_purpose_extension.png';

    }else if (type == 'Extension' && cat == 'Retail') {
      return baseIcon + 'retail_extension.png';

    }else if (type == 'Extension' && cat == 'Residential') {
      return baseIcon + 'residential_extension.png';

    }else if (type == 'Extension' && cat == 'Religious') {
      return baseIcon + 'religious_extension.png';

    }else if (type == 'Extension' && cat == 'Office') {
      return baseIcon + 'office_extension.png';

    }else if (type == 'Extension' && cat == 'Multi Purpose') {
      return baseIcon + 'multi_purpose_extension.png';

    }else if (type == 'Extension' && cat == 'Military') {
      return baseIcon + 'military_extension.png';

    }else if (type == 'Extension' && cat == 'Industrial') {
      return baseIcon + 'industrial_extension.png';

    }else if (type == 'Extension' && cat == 'Hotel') {
      return baseIcon + 'hotel_extension.png';

    }else if (type == 'Extension' && cat == 'Health & Care') {
      return baseIcon + 'health_care_extension.png';

    }else if (type == 'Extension' && cat == 'Government') {
      return baseIcon + 'government_extension.png';

    }else if (type == 'Extension' && cat == 'Educational') {
      return baseIcon + 'education_extension.png';

    }else if (type == 'Extension' && cat == 'Civic') {
      return baseIcon + 'civic_extension.png';

    }else if (type == 'Extension' && cat == 'Agricultural') {
      return baseIcon + 'agricultural_extension.png';

    }
    
    
    else if (type == 'New building' && cat == 'Transport') {
      return baseIcon + 'transport_new_building.png';
    }
    else if (type == 'New building' && cat == 'Special purpose') {
      return baseIcon + 'special_purpose_new_building.png';

    }else if (type == 'New building' && cat == 'Retail') {
      return baseIcon + 'retail_new_building.png';

    }else if (type == 'New building' && cat == 'Residential') {
      return baseIcon + 'residential_new_building.png';

    }else if (type == 'New building' && cat == 'Religious') {
      return baseIcon + 'religious_new_building.png';

    }else if (type == 'New building' && cat == 'Office') {
      return baseIcon + 'office_new_building.png';

    }else if (type == 'New building' && cat == 'Multi Purpose') {
      return baseIcon + 'multi_purpose_new_building.png';

    }else if (type == 'New building' && cat == 'Military') {
      return baseIcon + 'military_new_building.png';

    }else if (type == 'New building' && cat == 'Industrial') {
      return baseIcon + 'industrial_care_new_building.png';

    }else if (type == 'New building' && cat == 'Hotel') {
      return baseIcon + 'hotel_care_new_building.png';

    }else if (type == 'New building' && cat == 'Health & Care') {
      return baseIcon + 'health_care_new_building.png';

    }else if (type == 'New building' && cat == 'Government') {
      return baseIcon + 'government_new_building.png';

    }else if (type == 'New building' && cat == 'Educational') {
      return baseIcon + 'education_new_building.png';

    }else if (type == 'New building' && cat == 'Civic') {
      return baseIcon + 'civic_new_building.png';

    }else if (type == 'New building' && cat == 'Agricultural') {
      return baseIcon + 'agricultural_new_building.png';

    }



    else if (type == 'Interiour' && cat == 'Transport') {
      return baseIcon + 'transport_interiour.png';
    
    }else if (type == 'Interiour' && cat == 'Special purpose') {
      return baseIcon + 'special_purpose_interiour.png';

    }else if (type == 'Interiour' && cat == 'Retail') {
      return baseIcon + 'retail_interiour.png';

    }else if (type == 'Interiour' && cat == 'Residential') {
      return baseIcon + 'residential_interiour.png';

    }else if (type == 'Interiour' && cat == 'Religious') {
      return baseIcon + 'religious_interiour.png';

    }else if (type == 'Interiour' && cat == 'Office') {
      return baseIcon + 'office_interiour.png';

    }else if (type == 'Interiour' && cat == 'Multi Purpose') {
      return baseIcon + 'multi_purpose_interiour.png';

    }else if (type == 'Interiour' && cat == 'Military') {
      return baseIcon + 'military_interiour.png';

    }else if (type == 'Interiour' && cat == 'Industrial') {
      return baseIcon + 'industrial_interiour.png';

    }else if (type == 'Interiour' && cat == 'Hotel') {
      return baseIcon + 'hotel_interiour.png';

    }else if (type == 'Interiour' && cat == 'Health & Care') {
      return baseIcon + 'health_care_interiour.png';

    }else if (type == 'Interiour' && cat == 'Government') {
      return baseIcon + 'government_interiour.png';

    }else if (type == 'Interiour' && cat == 'Educational') {
      return baseIcon + 'education_interiour.png';

    }else if (type == 'Interiour' && cat == 'Civic') {
      return baseIcon + 'civic_interiour.png';

    }else if (type == 'Interiour' && cat == 'Agricultural') {
      return baseIcon + 'agricultural_interiour.png';

    }


    
    else if (type == 'Competition' && cat == 'Transport') {
      return baseIcon + 'transport_competition.png';

    }else if (type == 'Competition' && cat == 'Special purpose') {
      return baseIcon + 'special_competition.png';

    }else if (type == 'Competition' && cat == 'Retail') {
      return baseIcon + 'retail_competition.png';

    }else if (type == 'Competition' && cat == 'Residential') {
      return baseIcon + 'residential_competition.png';

    }else if (type == 'Competition' && cat == 'Religious') {
      return baseIcon + 'religious_competition.png';

    }else if (type == 'Competition' && cat == 'Office') {
      return baseIcon + 'office_competition.png';

    }else if (type == 'Competition' && cat == 'Multi Purpose') {
      return baseIcon + 'multi_purpose_competition.png';

    }else if (type == 'Competition' && cat == 'Military') {
      return baseIcon + 'military_competition.png';

    }else if (type == 'Competition' && cat == 'Industrial') {
      return baseIcon + 'industrial_competition.png';

    }else if (type == 'Competition' && cat == 'Hotel') {
      return baseIcon + 'hotel_competition.png';

    }else if (type == 'Competition' && cat == 'Health & Care') {
      return baseIcon + 'health_care_competition.png';

    }else if (type == 'Competition' && cat == 'Government') {
      return baseIcon + 'government_competition.png';

    }else if (type == 'Competition' && cat == 'Educational') {
      return baseIcon + 'education_competition.png';

    }else if (type == 'Competition' && cat == 'Civic') {
      return baseIcon + 'civic_competition.png';

    }else if (type == 'Competition' && cat == 'Agricultural') {
      return baseIcon + 'agricultural_competition.png';

    }
    

    else if (type == 'Thesis' && cat == 'Transport') {
      return baseIcon + 'transport_thesis.png';

    }else if (type == 'Thesis' && cat == 'Special purpose') {
      return baseIcon + 'special_thesis.png';

    }else if (type == 'Thesis' && cat == 'Retail') {
      return baseIcon + 'retail_thesis.png';

    }else if (type == 'Thesis' && cat == 'Residential') {
      return baseIcon + 'residential_thesis.png';

    }else if (type == 'Thesis' && cat == 'Religious') {
      return baseIcon + 'religious_thesis.png';

    }else if (type == 'Thesis' && cat == 'Office') {
      return baseIcon + 'office_thesis.png';

    }else if (type == 'Thesis' && cat == 'Multi Purpose') {
      return baseIcon + 'multi_purpose_thesis.png';

    }else if (type == 'Thesis' && cat == 'Military') {
      return baseIcon + 'military_thesis.png';

    }else if (type == 'Thesis' && cat == 'Industrial') {
      return baseIcon + 'industrial_thesis.png';

    }else if (type == 'Thesis' && cat == 'Hotel') {
      return baseIcon + 'hotel_thesis.png';

    }else if (type == 'Thesis' && cat == 'Health & Care') {
      return baseIcon + 'health_care_thesis.png';

    }else if (type == 'Thesis' && cat == 'Government') {
      return baseIcon + 'government_thesis.png';

    }else if (type == 'Thesis' && cat == 'Educational') {
      return baseIcon + 'education_thesis.png';

    }else if (type == 'Thesis' && cat == 'Civic') {
      return baseIcon + 'civic_thesis.png';

    }else if (type == 'Thesis' && cat == 'Agricultural') {
      return baseIcon + 'agricultural_thesis.png';

    }



    else if (type == 'Job' && cat != '') {
      return baseIcon + 'job.png';

    }
    else if (type == 'Landscape' && cat != '') {
      return baseIcon + 'landscape.png';

    }
    else if (type == 'Urbanism' && cat != '') {
      return baseIcon + 'urbanism.png';

    }else if (type == 'Exhibition' && cat != '') {
      return baseIcon + 'exhibition.png';

    }
    else if (type == 'Teaching' && cat != '') {
      return baseIcon + 'teaching.png';

    }
    else if (type == 'Event' && cat != '') {
      return baseIcon + 'event.png';

    }

  }

  loc = { lat: 28.60986453001585, lng: 77.3846419721832 };

  loc2 = { lat: 28.854161458374126, lng: 77.33640512525938 };
  
  initMap(searchzoomView) {
    var zoomView = 13
    if(searchzoomView != ''){
      zoomView = searchzoomView 
    }

    // console.log(this.current_postion)
    var that = this;
    var options = {
      center: { lat: 28.6056448, lng: 77.38982399999999 },
      zoom: zoomView,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
      }

    }

    this.map = new google.maps.Map(document.getElementById('map'), options);

    this.createPostMap = new google.maps.Map(document.getElementById("create_post_map"), options);

    this.create_company_profile = new google.maps.Map(document.getElementById("create_company_profile"), options);

    // open question post dialog

    // console.log(this.current_lat, this.current_long)


    // custom set marker
    this.setPostMarkers(this.map);
    this.setBusinessMarkers(this.map);


    // this.locate_marker_on_map(this.loc , this.createPostMap)

    this.setMapToCurrentLocation(this.map)

    this.locate_marker_on_map(this.loc, this.map)


    // console.log(current_lat,current_long)


    this.locate_marker_on_map2(this.loc, this.create_company_profile)


    // by default lo lon for address

    $('#map-lat').val(this.loc.lat)
    $('#map-lon').val(this.loc.lng)


    google.maps.event.addListener(this.post_marker2, 'dragend', function () {
      // console.log(this.getPosition().lat(), this.getPosition().lng())
      $('#map-lat').val(this.getPosition().lat())
      $('#map-lon').val(this.getPosition().lng())

    });



    // click on map event listner
    google.maps.event.addListener(this.map, 'dblclick', function (event) {
      

      if (that.ApiService.checkIsLogin()) {

        // console.log(that.ApiService.getUserData().is_profile_created)
        if (!that.ApiService.getUserData().is_profile_created) {

          that.toast.error('Please create profile first')
          $('#create-profile').modal('show')
          return false;
        }

      } else {

        that.toast.error('Please login')
        $('#login').modal('show')
        return false;
      }

      this.clicked_location_lat = event.latLng.lat()
      this.clicked_location_lng = event.latLng.lng()

     

      $("#involvement").modal('show');

      // set clicked location with marker on model
      that.createPostMap.setCenter({ lat: this.clicked_location_lat, lng: this.clicked_location_lng });

      // clear previous marker
      // that.post_marker.setPosition({ lat: this.clicked_location_lat, lng: this.clicked_location_lng });

      $('#map-lat').val(event.latLng.lat())
      $('#map-lon').val(event.latLng.lng())

    });
    var mapType = new google.maps.StyledMapType(this.stylez, { name: "Grayscale" });
    this.map.mapTypes.set('tehgrayz', mapType);
    this.map.setMapTypeId('tehgrayz');
    this.createPostMap.mapTypes.set('tehgrayz', mapType);
    this.createPostMap.setMapTypeId('tehgrayz');
    this.create_company_profile.mapTypes.set('tehgrayz', mapType);
    this.create_company_profile.setMapTypeId('tehgrayz');
  };




  // set map to current location

  setMapToCurrentLocation(map) {
    // console.log('clicked')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        map.setCenter(initialLocation);
      });
    }
  }


  GetCenterLocation(event) {
    // console.log(this.map.getCenter())
    // get center location of map
    $('#map-lat').val(this.createPostMap.getCenter().lat())
    $('#map-lon').val(this.createPostMap.getCenter().lng())

  }

  SetMapToCurrentLocationEvent() {
    this.setMapToCurrentLocation(this.map)
  }


  bindInfoWindow(marker, map, infowindow, description) {
    marker.addListener('click', function() {
        infowindow.setContent(description);
        infowindow.open(map, this);
      });
  }


  // set post on map
  setPostMarkers(map) {

      window.navigator.geolocation.getCurrentPosition(data => {
        this.current_lat = data.coords.latitude
        this.current_long = data.coords.longitude
        console.log( this.current_lat)
      })

    for (var i = 0; i < this.posts.length; i++) {
      var marker= new google.maps.Marker({
        position: { lat: parseFloat(this.posts[i].lat), lng: parseFloat(this.posts[i].lon) },
        map: map,
        icon: this.getflag(this.posts[i].project_type.type, this.posts[i].project_category),
      });
      //this.bindInfoWindow(marker, map, this.infowindow, '<div><a href="/involvement/'+this.posts[i].id+'">click</a></div>');

      this.bindInfoWindow(marker, map, this.infowindow, `<div class="prop-card m-0">
        <div class="prop-img yellow-img">
          <a target="_blank" href="/involvement/`+ this.posts[i].id+`"><img src="`+ this.posts[i].post_image.image +`" alt=""></a>
        </div>
        <div class="prop-info pt-2">
          <ul>
            <li class="fw-600">`+this.posts[i].name+`</li>
            <li class="fw-600">`+ this.posts[i].project_type.type+`</li>
          </ul>
          <ul>
            <li><a href="http://maps.google.com/maps?saddr=`+this.current_lat+','+this.current_long+'&daddr='+this.posts[i].lat+','+this.posts[i].lon+`" class="fa fa-paper-plane pull-right ml-2 whpc-20" target="_blank"></a>`
            +this.posts[i].city+','+ this.posts[i].country+`</li>
            <li>`+this.posts[i].year +`</li>
          </ul>
        </div>
      </div>`);
      
    }
  }

  
  setBusinessMarkers(map) {

    for (var i = 0; i < this.business_pins.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: parseFloat(this.business_pins[i].lat), lng: parseFloat(this.business_pins[i].lon) },
        map: map,
        icon: this.getBusinessflag(this.business_pins[i].business_type),
      });

      // google.maps.event.addListener(marker, 'click', function() {
      //   map.setCenter(marker.position)
      // });
    }

  }

  bindClickOnquestion(marker){
    var that =this
    marker.addListener('click', function() {
      that.router.navigate([]).then(result => {  window.open(marker.url, '_blank', 'location=yes'); });
    });

  }


  // set question on map
  setQuestionMarkers(map) {

    for (var i = 0; i < this.questionPosts.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: parseFloat(this.questionPosts[i].lat), lng: parseFloat(this.questionPosts[i].lon) },
        map: map,
        icon: '/assets/images/icon_web/public_space.png',
        url: '/public-detailed-view/'+this.questionPosts[i].id,
      });
      this.markersArray.push(marker)
      this.bindClickOnquestion(marker)
    
      
    }
    
  }

  

  // clear question from map
  clearQuestionFromMap() {
    for (var i = 0; i < this.markersArray.length; i++) {
      this.markersArray[i].setMap(null);
    }
    this.markersArray.length = 0;
  }

  // clear select location marker from map
  clearPostCreateFromMap() {
    for (var i = 0; i < this.markersArray.length; i++) {
      this.markersArray[i].setMap(null);
    }
    this.markersArray.length = 0;
  }


  changeSliderEvent(event) {
    // console.log(event)
    if (event.target.checked) {
      this.setQuestionMarkers(this.map)

    } else {

      this.clearQuestionFromMap()
    }

  }

  locate_marker_on_map(location, map) {

    this.post_marker = new google.maps.Marker({
      position: location,
      map: map,
      animation: google.maps.Animation.DROP,
      title: "Post location"
    });
  }

  locate_marker_on_map2(location, map) {

    this.post_marker2 = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: "Post location"
    });
  }




  openQuestionDialog() {
    this.QuestCreateForm = this.fb.group({
      nickName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    $("#imagefile").attr('src', '/assets/images/place_image.png');
    $("#questimg").val('');
    $('#post-question').modal('show');
  }

  saveQuestion(event) {

    if (!this.ApiService.checkIsLogin()) {
      this.toast.error('Please login')
      return;
    }

    this.isDescription = false;
    this.isImage = false;

    if (this.QuestCreateForm.value.description == '') {
      this.message = 'Description field is required'
      this.isDescription = true
      return;
    }
    if (this.singleFiles == null) {
      this.message = 'Please upload file'
      this.isImage = true
      return;
    }

    //get access of geolocation
    // console.log(this.map.getCenter())

    var mylat = this.map.getCenter().lat()
    var mylon = this.map.getCenter().lng()


    this.formData = new FormData
    this.formData.append('nickname', this.QuestCreateForm.value.nickName)
    this.formData.append('country_code', this.ApiService.getUserData().country_code),
      this.formData.append('mobile_number', this.ApiService.getUserData().mobile_number),
      this.formData.append('picture', this.singleFiles)
    this.formData.append('question_text', this.QuestCreateForm.value.description)
    this.formData.append('lat', mylat)
    this.formData.append('lon', mylon)

    this.ApiService.create_quest(this.formData).subscribe(response => {
      this.toast.success(response.message)
      $('#post-question').modal('hide')
    }), error => {
      this.toast.error(error.error.message)
    }
  }


  onFileChanged(event) {
    var singleFiles = event.target.files;
    var file = event.target.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
      $('#questimg').val('')
      $('#imagefile').attr('src', '/assets/images/place_image.png')
      this.toast.error('Whoops! That is not an image!')
    }

    if (singleFiles) {
      for (let file of singleFiles) {
        let singleReader = new FileReader();
        singleReader.onload = (e: any) => {
          $('#imagefile').attr('src', e.target.result)
        }
        singleReader.readAsDataURL(file);
      }
    }
    this.singleFiles = event.target.files[0];
    this.isImage = false;
  }


  

  load_create_posts() {
    this.api_get_project_type()
    this.api_get_project_category()
  }

  validate_create_posts() {
    var projTyp = this.postForm.value.project_type
    var projCat = this.postForm.value.project_category;
    debugger
    if(projTyp != 'Select Project Type'){
      var project_type = this.postForm.value.project_type;
    }else{ var project_type = null}

    if(projCat != 'Select Project Category'){
      var project_category = this.postForm.value.project_category;
    }else { var project_category = null}

    var name = this.postForm.value.name;
    var year = this.postForm.value.year;
    var about_post = this.postForm.value.about_post;
    var images = this.postImage;
    var t_type_start_date = this.postForm.value.t_type_start_date;
    var t_type_end_date = this.postForm.value.t_type_end_date;
    var s = Date.parse(t_type_start_date)
    var e = Date.parse(t_type_end_date)

    if (!name || name == "") {
      this.loginError("Please provide project name");
      return false;
    }
    if (!project_type || project_type == "") {
      this.loginError("Please provide project type");
      return false;
    }
    if (this.starType == true && (!project_category || project_category == "")) {
      this.loginError("Please provide project category");
      return false;
    }
    if (this.typ == 0 && (!year || year == "")) {
      this.loginError("Please provide year");
      return false;
    }

    if (this.typ == 0 && ((year).toString().length < 4)) {
      this.loginError("Please enter year in YYYY format");
      return false;

    }
    if (this.typ == 1 && (!t_type_start_date || t_type_start_date == "")) {
      this.loginError("Please provide start date");
      return false;
    }
    if (this.typ == 1 && (!t_type_end_date || t_type_end_date == "")) {
      this.loginError("Please provide end date");
      return false;
    } else {
      // console.log(s)
      // console.log(e)
    }
    if (this.typ == 1 && (e <= s)) {
      this.loginError("End date should be Greater");
      return false;
    }
    if (this.taggs.length == 0) {
      this.loginError("Please provide tags");
      return false;
    }
    if (!about_post || about_post == "") {
      this.loginError("Please provide descriptions");
      return false;
    }
    if (this.base64Image.length <= 0) {
      this.loginError("Please provide images");
      return false;
    }

    if (!$('#post_perms').is(":checked")) {
      this.loginError("Please accept content terms and conditions");
      return false;
    }
    return true;
  }

  api_get_project_type() {
    this.ApiService.getProjectType()
      .subscribe(
        (response: any) => {
          this.project_typeData = response['data']
        },
        error => {
          console.log('error', error)
          this.loginError(error.error.message);
        }
      );
  }


  getType() {
    var id = $("#selType :selected").val();
    for (var i of this.project_typeData) {
      if (i.id == id) {
        var checkType = i.is_t_type
        this.starType = i.is_star_type
        // console.log(this.starType)
      }
    }
    if (checkType == true) {
      this.typ = 1
    } else {
      this.typ = 0
    }
    if (this.starType == false) {
      this.hideCat = 1
    } else {
      this.hideCat = 0
    }
  }


  api_get_project_category() {
    this.ApiService.getProjectCategory().subscribe(
      (response: any) => {
        this.project_categoryData = Object.values(response.data)
      },
      error => {
        console.log('error', error)
        this.loginError(error.error.message);
      }
    );
  }

  emptyPostForm() {
    this.postForm.setValue({
      name: '',
      project_type: '',
      project_category: '',
      year: '',
      t_type_end_date: '',
      t_type_start_date: '',
      tags: '',
      about_post: '',
      images: null,

    });
    for(var i=0; i < this.imageTags.length; i++){
      $('#imgTag'+i).val('');
    }
    this.taggs = [];
    this.selectedImages = [];
    this.base64Image = [];
    this.imageTags = [];

  }

  getStrEndDate() {
    if ($('#start-date').val()) {
      this.strD = $('#start-date').val();
    } else { this.strD = "2020-07-15" }
    if ($('#end-date').val()) {
      this.endD = $('#end-date').val();
    } else { this.endD = "2021-07-16" }
  }

  hit() {
    var img_tagg = $('#creditt').val()
    this.postImageTag = img_tagg
  }
sendingtags:any = [];
sendingUsertags:any = [];
  getTags(){
    for(var i of this.taggs){
      this.sendingtags.push(i.name)
    }

    for(var j in this.userTaggs){
      this.sendingUsertags.push(this.userTaggs[j].id)
      // console.log(this.sendingUsertags)
    }
    
    
  }
  // getMoreValues(callback){
  //   this.latitude = $('#map-lat').val()
  //     this.longitude = $('#map-lon').val()
    
  //     this.ApiService.getaddress(this.latitude, this.longitude).subscribe(x=>{
  //     console.log(x)
  //   })
  // }

  getMoreValues(callback) {
    this.latitude = $('#map-lat').val()
    this.longitude = $('#map-lon').val()

    this.ApiService.getAddressFromLatLng(this.latitude + ',' + this.longitude).then(
      result => {

        var address = result[0].Location.Address
        console.log(result)

        this.country = address.AdditionalData[0].value
        this.posttalcode = address.PostalCode
        this.city = address.City
        this.street = address.Label
        if (callback) callback();
      },
      error => {
        console.log('error', error)
        // this.loginError(error.error.message);
        this.country = 'NA'
        this.posttalcode = ''
        this.city = 'NA'
        this.street = ''

      }
    );
  }


  api_create_posts() {
    debugger

    if (this.postForm.value.project_category=='Select Project Category'){
      this.postForm.value.project_category = ''
    }

    const postData = new FormData();
    postData.append('name', this.postForm.value.name),
      postData.append('project_type', this.postForm.value.project_type),
      postData.append('project_category', this.postForm.value.project_category),
      postData.append('year', this.postForm.value.year),
      postData.append('tags', this.sendingtags.toString()),
      postData.append('about_post', this.postForm.value.about_post),
      postData.append('lat', this.latitude),
      postData.append('lon', this.longitude),
      postData.append('taged_users', this.sendingUsertags.toString()),
      this.selectedImages.map(img => {
        postData.append('images', img);
      });
    postData.append('image_tag', this.imageTags.toString()),
      postData.append('t_type_end_date', this.endD),
      postData.append('t_type_start_date', this.strD),
      postData.append('country', this.country),
      postData.append('city', this.city),
      postData.append('zip_code', this.posttalcode),
      postData.append('street', ''),

      this.ApiService.postsCreate(postData).subscribe(
        (response: any) => {

          this.toast.success('success', response.message)
          this.emptyPostForm();
          $("#involvement").modal('hide');

          this.ngOnInit();

        },
        error => {

          this.toast.error(error.error.message)

        }
      );
  }

  submit_create_posts() {
    
    this.getTags();
    if (this.validate_create_posts()) {
      this.getImageTag();
      this.getStrEndDate();
      this.getMoreValues(() => {
        debugger
        this.api_create_posts();
      });


    }
  }


  loginError(e) {
    console.log(e);

    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

}
