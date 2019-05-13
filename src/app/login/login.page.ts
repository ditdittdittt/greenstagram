import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	email: string = ""
	password: string = ""

	constructor(private route: Router,public afAuth: AngularFireAuth, public user: UserService, public router: Router, public alertController: AlertController) { }

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

	async login() {
		const { email, password} = this
		try {
			// kind of a hack. 
			const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password)
			await this.user.reAuth(email, password)
			if(res.user) {
				this.user.setUser({
					email,
					uid: res.user.uid,
					username: res.user.username,
					name: res.user.name,
					community: res.user.community
				})
				this.router.navigate(['/tabs/feed'])
			}
		
		} catch(err) {
			console.dir(err),
			await this.presentAlert("Failed", err)
			if(err.code === "auth/user-not-found") {
				console.log("User not found")
			}
		}
	}

	goToRegister(){
		this.route.navigate(['register']);
	}

	backTo(){
		this.route.navigate(['tabs','feed'])
	}

	forgotPassword(){
		this.route.navigate(['forgot-password'])
	}

}
