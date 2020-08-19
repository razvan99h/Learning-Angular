import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { MovieService } from './shared/services/movie.service';
import { SharedService } from './shared/services/shared.service';
import { ReservationService } from './shared/services/reservation.service';

import { SharedModule } from './shared/shared.module';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MatIconModule } from '@angular/material/icon';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CinemaCreateComponent } from './pages/cinema/cinema-create-edit/cinema-create/cinema-create.component';

import { CinemaListComponent } from './pages/cinema/cinema-list-details/cinema-list/cinema-list.component';
import { CinemaComponent } from './pages/cinema/cinema.component';
import { CinemaService } from './shared/services/cinema.service';
import { CinemaEditComponent } from './pages/cinema/cinema-create-edit/cinema-edit/cinema-edit.component';
import { CinemaDetailsComponent } from './pages/cinema/cinema-list-details/cinema-details/cinema-details.component';
import { CinemaMovieAddComponent } from './pages/cinema/cinema-list-details/cinema-details/cinema-movie-add/cinema-movie-add.component';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from './shared/services/auth.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MovieDetailsComponent,
    ReservationComponent,
    CinemaCreateComponent,
    CinemaListComponent,
    CinemaComponent,
    CinemaEditComponent,
    CinemaDetailsComponent,
    CinemaMovieAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    FormsModule,
    MatSelectModule,
    MatSnackBarModule,
    AngularFireModule.initializeApp(environment.FIREBASE),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    MovieService,
    SharedService,
    ReservationService,
    CinemaService,
    AuthService,
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
