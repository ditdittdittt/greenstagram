import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  
  items: Observable <any[]>
  heartType: string = "heart-empty"
  
  constructor(db: AngularFirestore) { 
    this.items = db.collection('posts').valueChanges();
  }

  ngOnInit() {
  }


}
