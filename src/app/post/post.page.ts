import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app'

@Component({
	selector: 'app-post',
	templateUrl: './post.page.html',
	styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

	postID: string
	effect: string = ''
	post
	postReference: AngularFirestoreDocument
	sub
	comment: string
	currentUser: string

	heartType: string = "heart-empty"

	constructor(
		private route: ActivatedRoute, 
		private afs: AngularFirestore,
		private user: UserService) {

	}


	ngOnInit() {
		this.postID = this.route.snapshot.paramMap.get('id')
		this.postReference = this.afs.doc(`posts/${this.postID}`)
		this.sub = this.postReference.valueChanges().subscribe(val => {
			this.post = val
			this.effect = val.effect
			this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-empty'
		})
		this.currentUser = this.user.getUID()
		if(this.currentUser){
		
		}
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	toggleHeart() {
		if(this.heartType == 'heart-empty') {
			this.postReference.update({
				likes: firestore.FieldValue.arrayUnion(this.user.getUID())
			})
		} else {
			this.postReference.update({
				likes: firestore.FieldValue.arrayRemove(this.user.getUID())
			})
		}
	}

	insertComment(commentInput: string) {
		const comment = commentInput
		const user = this.user.getUID()

		this.afs.doc(`posts/${this.postID}`).update({
			comment: firestore.FieldValue.arrayUnion(`${comment}`)
		})

		this.afs.doc(`comment/${comment}`).set({
			detail: comment,
			author: user
		})
		
		this.comment = ""
	}
}
