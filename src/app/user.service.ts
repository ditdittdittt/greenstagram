import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { first } from 'rxjs/operators'
import { auth } from 'firebase/app'

interface user {
	email: string,
	uid: string,
	username: string,
}

@Injectable()
export class UserService {
	private user: user

	constructor(private afAuth: AngularFireAuth) {

	}

	setUser(user: user) {
		this.user = user
	}

	getUsername(): string {
		return this.user.username
	}

	reAuth(email: string, password: string) {
		return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(email, password))
	}

	updatePassword(newpassword: string) {
		return this.afAuth.auth.currentUser.updatePassword(newpassword)
	}

	updateEmail(newemail: string) {
		return this.afAuth.auth.currentUser.updateEmail(newemail)
	}

	async isAuthenticated() {
		if(this.user) return true

		const user = await this.afAuth.authState.pipe(first()).toPromise()

		if(user) {
			this.setUser({
				uid: user.uid,
				email: user.email,
				username: user.username,
			})

			return true
		}
		return false
}

	getUID(): string {
		return this.user.uid
	}
}