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
import { CreateCinemaComponent } from './pages/cinema/create-cinema/create-cinema.component';
import { CinemaListComponent } from './pages/cinema/cinema-list/cinema-list.component';
import { CinemaComponent } from './pages/cinema/cinema.component';
import { CinemaService } from './shared/services/cinema.service';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MovieDetailsComponent,
    ReservationComponent,
    CreateCinemaComponent,
    CinemaListComponent,
    CinemaComponent,
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
    AngularFireModule.initializeApp(environment.FIREBASE),
    AngularFireDatabaseModule
  ],
  providers: [
    MovieService,
    SharedService,
    ReservationService,
    CinemaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
