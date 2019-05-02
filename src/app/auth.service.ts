import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import { UserService } from './user.service'
import { AlertController } from '@ionic/angular';

@Injectable()
export class AuthService implements CanActivate {

	constructor(private router: Router, private user: UserService, private alertController: AlertController) {

	}

	async canActivate(route) {
		if(await this.user.isAuthenticated()) {
			return true
		}

		const alert = await this.alertController.create({
			header: 'Sorry',
			message: 'You must login first!',
			buttons: ['Okay']
		})

		await alert.present()

		this.router.navigate(['/login'])
		return false
	}

}