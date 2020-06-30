import { Component, OnInit } from '@angular/core';
import { ApiService} from '../../service/api/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notificationList


  constructor(
    private Api: ApiService
  ) { }

  ngOnInit() {

      let UserData = this.Api.getUserData()
// console.log(UserData,'dd');
  this.getNotifications(UserData['id'])
  }

  getNotifications(id){
    let dataTosend = {
      notification_for_user: id
    }
    this.Api.getNotifcations(dataTosend).subscribe((res:any)=>{
      this.notificationList = res['data']
      console.log(this.notificationList, "NOtificationsList");
      
    })
  }

}
