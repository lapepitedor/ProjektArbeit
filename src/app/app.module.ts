import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { firebaseConfig } from './app.firebase.config';

//firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { Firestore, FirestoreModule } from '@angular/fire/firestore';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AuthGuard } from './core/service/auth.guard';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        // FirestoreModule
        AngularFireStorageModule,
        SharedModule,
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp(firebaseConfig))

    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
