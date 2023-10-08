import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoggedGuard } from './shared/guards/not-logged.guard';
import { AlreadyLoggedGuard } from './shared/guards/already-logged.guard';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

import { AccountComponent } from './components/account/account.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContactsComponent } from './components/contacts/contacts.component';






const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },

  { path: 'landing-page', component: LandingPageComponent },
  { path: 'access-denied', component: AccessDeniedComponent },

  { path: 'sign-in', component: SignInComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AlreadyLoggedGuard] },

  { path: 'account/:uid', component: AccountComponent, canActivate: [NotLoggedGuard] },
  { path: 'menu', component: MenuComponent, children: [{ path: ':pizzaid', component: MenuComponent }]},

  { path: 'contacts', component: ContactsComponent},
  
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
