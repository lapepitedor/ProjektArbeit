import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AuthGuard } from './core/service/auth.guard';
import { NotFoundComponent } from './template/main/views/not-found/not-found.component';


const firebaseConfig = {
  apiKey: 'AIzaSyBnQX5lAfkDq20CTmZs2y7ugneYuhOVh90',
  authDomain: 'myexpensetrack-82af3.firebaseapp.com',
  projectId: 'myexpensetrack-82af3',
  storageBucket: 'myexpensetrack-82af3.appspot.com',
  messagingSenderId: '1039796224676',
  appId: '1:1039796224676:web:36e15b7f05b989a1085c31',
};

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    SharedModule,
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
