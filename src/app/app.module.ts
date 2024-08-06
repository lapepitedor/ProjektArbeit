import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { firebaseConfig } from './app.firebase.config';

//firebase
import { AngularFireModule } from '@angular/fire/compat';

import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { Firestore, FirestoreModule } from '@angular/fire/firestore';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AuthGuard } from './core/service/auth.guard';
import { NotFoundComponent } from './template/main/views/not-found/not-found.component';


@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    // FirestoreModule
    SharedModule,
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
