import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'

import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	username: string = ""
	email: string = ""
	name: string = ""
	password: string = ""
	cpassword: string = ""

	constructor(
		public afAuth: AngularFireAuth,
		public afstore: AngularFirestore,
		public user: UserService,
		public alertController: AlertController,
		public router: Router
		) { }

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

	async register() {
		const { email, password, cpassword, username, name } = this
		if(password !== cpassword) {
			return console.error("Passwords don't match")
		}

		try {
			const res = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)

			this.afstore.doc(`users/${res.user.uid}`).set({
				username,
				email,
				name,
				password,
			})

			this.user.setUser({
				email,
				uid: res.user.uid,
				username,
			})

			this.presentAlert('Success', 'You are registered!')
			this.router.navigate(['/tabs'])

		} catch(error) {
			console.dir(error),
			this.presentAlert('Failed', error)
		}
	}

}
