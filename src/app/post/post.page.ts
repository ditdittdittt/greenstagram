import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore, User } from 'firebase/app'

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
		private user: UserService,
		private alertController: AlertController,
		private router: Router) {

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
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present()
	}

	toggleHeart() {
		if(this.currentUser){
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
		else if (!this.currentUser){
			this.presentAlert('Sorry', 'Kamu harus login dulu')
			this.router.navigate(['login'])
		}
	}

	insertComment(commentInput: string) {
		const comment = commentInput

		this.afs.doc(`posts/${this.postID}`).update({
			comment: firestore.FieldValue.arrayUnion(`${this.user.getName()} said "${comment}"`)
		})
		
		this.comment = ""
	}
}