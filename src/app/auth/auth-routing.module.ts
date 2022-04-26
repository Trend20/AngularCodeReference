import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnvironmentGuardGuard } from './environment-guard.guard';
import { LoginLoaderComponent } from './login-loader/login-loader.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [EnvironmentGuardGuard]
  },
  {
    path: 'autologin',
    component: LoginLoaderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
