import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { LayoutModule } from '@angular/cdk/layout';
import { LayoutsComponent } from './layouts.component';
import {AuthGuard} from "../auth/auth.guard";


const routes: Routes = [
  {
    path: '',
    component: LayoutsComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./tracking-ui/tracking-ui.module').then(m => m.TrackingUiModule), canActivate: [AuthGuard]
      },
      {
        path: 'smsf',
        loadChildren: () => import('./debs/debs.module').then(m => m.DebsModule), canActivate: [AuthGuard]
      },

      {
        path: 'sign',
        loadChildren: () => import('./signature/signature.module').then(m => m.SignatureModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
