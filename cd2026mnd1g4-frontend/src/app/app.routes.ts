import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './auth/login.component';
import { ItWorksComponent } from './main/it-works.component';
import { CustomerIdentifyComponent } from './main/waiter/customer-identify.component';
import { CustomerRegisterComponent } from './main/waiter/customer-register.component';
import { OrderComponent } from './main/waiter/order.component';
import { WaiterSelectComponent } from './main/waiter/waiter-select.component';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'it-works', component: ItWorksComponent, canActivate: [authGuard] },
	{
		path: 'main',
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'waiter' },
			{
				path: 'waiter',
				children: [
					{ path: '', component: WaiterSelectComponent },
					{ path: 'identify', component: CustomerIdentifyComponent },
					{ path: 'register', component: CustomerRegisterComponent },
					{ path: 'order', component: OrderComponent }
				]
			}
		]
	},
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: '**', redirectTo: 'login' }
];
