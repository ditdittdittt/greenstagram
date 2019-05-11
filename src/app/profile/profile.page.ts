import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-page',
	templateUrl: './profile.page.html',
	styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

	mainuser: AngularFirestoreDocument
	userPosts
	sub
	posts
	username: string
	profilePic: string
	community: string
	jumlahpost: string

	constructor(private afs: AngularFirestore, private user: UserService, private router: Router, public afAuth: AngularFireAuth, public alertController: AlertController) {
		this.mainuser = afs.doc(`users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.posts = event.posts
			this.username = event.username
			this.profilePic = event.profilePic
			this.community = event.community
			this.jumlahpost = event.posts.length
		})
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	goTo(postID: string) {

		this.router.navigate(['/tabs/post/' + postID.split('/')[0]])
	}
 

	ngOnInit() {
	}

	async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present()
	}

	signout() {
		this.afAuth.auth.signOut().then(() => {
			this.presentAlert("Success", "Kamu berhasil logout")
			this.router.navigate(['login'])
		})
	}
}
