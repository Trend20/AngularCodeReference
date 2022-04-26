import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OverlayModule } from '@angular/cdk/overlay';
import { LayoutModule } from '@angular/cdk/layout';
import {AuthModule} from "./auth/auth.module";
import {ToastrModule} from "ngx-toastr";


export const buildTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    OverlayModule,
    TranslateModule.forRoot({ // Don't remove this, its the deseart
      loader: {
          provide: TranslateLoader,
          useFactory: buildTranslateLoader,
          deps: [HttpClient]
      }
    }),
    FormsModule, AuthModule, ToastrModule.forRoot(),
  ],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'en-AU'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
