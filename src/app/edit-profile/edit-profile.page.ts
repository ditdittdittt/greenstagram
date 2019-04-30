import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.page.html',
	styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

	mainuser: AngularFirestoreDocument
	sub
	username: string
	profilePic: string
	email: string
	name: string
	password: string
	newpassword: string
	community: string

	busy: boolean = false

	@ViewChild('fileBtn') fileBtn: {
		nativeElement: HTMLInputElement
	}

	constructor(
		private http: Http, 
		private afs: AngularFirestore,
		private router: Router,
		private alertController: AlertController,
		private user: UserService) {
		this.mainuser = afs.doc(`users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.username = event.username,
			this.profilePic = event.profilePic,
			this.email = event.email,
			this.name = event.name,
			this.community = event.community
		})
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	updateProfilePic() {
		this.fileBtn.nativeElement.click()
	}

	uploadPic(event) {
		const files = event.target.files

		const data = new FormData()
		data.append('file', files[0])
		data.append('UPLOADCARE_STORE', '1')
		data.append('UPLOADCARE_PUB_KEY', 'f6ee612063fc8b27fc3c')
		
		this.http.post('https://upload.uploadcare.com/base/', data)
		.subscribe(event => {
			const uuid = event.json().file
			this.mainuser.update({
				profilePic: uuid
			})
		})

		this.presentAlert('Done','Berhasil diupdate')
		this.router.navigate['/tabs/profile']
	}

	async presentAlert(title: string, content: string) {
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['OK']
		})

		await alert.present()
	}

	async updateDetails() {
		this.busy = true

		if(!this.password) {
			this.busy = false
			return this.presentAlert('Error!', 'You have to enter a password')
		}

		try {
			await this.user.reAuth(this.user.getEmail(), this.password)
		} catch(error) {
			this.busy = false
			return this.presentAlert('Error!', 'Wrong password!')
		}

		if(this.newpassword) {
			await this.user.updatePassword(this.newpassword)
		}

		if(this.email !== this.user.getEmail()) {
			await this.user.updateEmail(this.email)
			this.mainuser.update({
				email: this.email
			})
		}

		this.password = ""
		this.newpassword = ""
		this.busy = false

		await this.presentAlert('Done!', 'Your profile was updated!')

		this.router.navigate(['/tabs/feed'])
	}

}
