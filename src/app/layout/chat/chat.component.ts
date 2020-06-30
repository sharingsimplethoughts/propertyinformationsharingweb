import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, } from '@angular/fire/database'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import {ApiService} from '../../service/api/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userData: any;
  userId: any;
  imageUrl: string;
  masterCopy: any = []
  


  constructor(
    private af: AngularFireDatabase,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api:ApiService
  ) { }

  ngOnInit() {

    this.imageUrl = environment.baseUrl.slice(0,-1)

    
    this.getList();

    this.getChatUserList()  
  //  let  timestamp = new Date().getTime().toString()

  //   let dataTosaveRecent = {
  //     id: this.userId,
  //     name: this.userData.company_detail['name'],
  //     profile_image:this.userData.company_detail['picture'],
  //     onlineState:"1",
  //     timeStamp:timestamp,
     
  // }
  // this.af.database.ref('/userState/' + this.userId.toString()).set(dataTosaveRecent)




  }

  // ngOnDestroy(){

  //   let  timestamp = new Date().getTime().toString()

  //   let dataTosaveRecent = {
  //     id: this.userId,
  //     name: this.userData.company_detail['name'],
  //     profile_image:this.userData.company_detail['picture'],
  //     onlineState:"0",
  //     timeStamp:timestamp,
     
  // }
  // this.af.database.ref('/userState/' + this.userId.toString()).set(dataTosaveRecent)


  // }
  
  AllMessagelists:any = []
  userStateData: any = []
  chatUserarr:any = []
  childKey1:any = []
  childData1:any = []

  searchUsers;

  getList() {
    debugger
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.userId = this.userData.id
   
    let ref = this.af.database.ref('/recentMessage/' + this.userId);
    let that = this
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        let childKey = childSnapshot.key
        let childData = childSnapshot.val();
       
        that.childKey1.push(childKey)
       that.childData1.push(childData)


       
      });


      
    });
   


    
    // this.af.list('/userState').valueChanges().subscribe(
    //   data => {
        
        
    //     this.userStateData = data
    //     console.log(this.userStateData,"userStatedata");
        
        
        
    //   }
    // );

    
    this.af.list('/recentMessage/' + this.userId).valueChanges().subscribe(
      data => {
        this.AllMessagelists = data
        // console.log(this.AllMessagelists, 'AllMessageList');
        
        ;
      }
     
    );

  

    setTimeout(() => {
      this.GetListfromUserState()
    }, 1500 );
    

    this.af.list('/userState').valueChanges().subscribe((data)=>{
      this.userStateData = data
      // console.log(this.userStateData, "userStates");
      
    })
// setTimeout(() => {
//   this.setProfileImage()
// }, 2000);
   
    
  }


//   searchClick(){
//     debugger
//   this.chatUserarr =   this.masterCopy.filter((a)=>{
//       if(a.name == this.searchUsers){
// return true
//       } else{
//         this.chatUserarr = this.masterCopy
//       }
//     })
      
//   }


applyFilter(filterValue: string) {
  debugger
  this.chatUserarr = this.masterCopy.filter((a)=>{

   return a.name.toLowerCase().includes(filterValue.toLowerCase());
    // return a.name.toLowerCase() == filterValue.toLowerCase()
  })
  // if (this.dataSource.paginator) {
  //   this.dataSource.paginator.firstPage();
  // }
}
// filterValue.trim().toLowerCase();
  // resetSearch(){
  //   this.chatUserarr = this.masterCopy
  // }



GetListfromUserState(){
  debugger
  for (let index = 0; index < (this.childKey1 || []).length; index++) {
    var x = this.userStateData.find((f) => {
      return this.childKey1[index] == f.id
    }
    )
    
    if(x) this.chatUserarr.push(x)
  }

  for (let index = 0; index < (this.chatUserarr || []).length; index++) {
       this.AllMessagelists.find((b)=>{
     if(this.chatUserarr[index].id == b.id){
       this.chatUserarr[index]['lastMessage'] = b.lastMessage
       this.chatUserarr[index]['mediaType'] = b.mediaType
       this.chatUserarr[index]['LastMessageTime'] = b.timeStamp
     }
   })
  
  }

  this.masterCopy = JSON.parse(JSON.stringify(this.chatUserarr))
  console.log(this.masterCopy, "masterCopy");
  
  var arr = this.childKey1.filter((e) =>
    this.userStateData.filter((f) => {
      return e.id == f.id
    }),
    // console.log(this.chatUserarr, 'chatUserarr')
  )
  
}
  chatInsight(data){
    
    this.router.navigate(['chat-insight/' + data.id])
  }


// setProfileImage(){
//   for (let index = 0; index < this.AllMessagelists.length; index++) {
      
//     this.userStateData.find((a)=>{
//       if(a.id == this.AllMessagelists[index].id){
//         this.AllMessagelists[index]['profile_image'] = a.profile_image
//       }
//     })
     
     
//    }

//    console.log(this.AllMessagelists, "mmm");
   
// }


  ChatUserList
  getChatUserList(){
   
    this.api.getChatUsers().subscribe((a)=>{
      
      this.ChatUserList = a['data']
      // console.log(this.ChatUserList, "ChatUserList");

    })
  }

}
