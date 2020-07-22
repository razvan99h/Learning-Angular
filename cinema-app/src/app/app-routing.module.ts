import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MovieDetailsResolverService } from './pages/movie-details/movie-details-resolver.service';
import { PageUnavailableComponent } from './shared/components/page-unavailable/page-unavailable.component';
import { CreateCinemaComponent } from './pages/cinema/create-cinema/create-cinema.component';
import { CinemaListComponent } from './pages/cinema/cinema-list/cinema-list.component';
import { CinemaComponent } from './pages/cinema/cinema.component';


const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'unavailable',
    component: PageUnavailableComponent,
  },
  {
    path: 'movie/:id',
    component: MovieDetailsComponent,
    children: [],
    resolve: {
      movie: MovieDetailsResolverService
    }
  },
  {
    path: 'cinema',
    component: CinemaComponent,
    children: [
      {
        path: '',
        component: CinemaListComponent
      },
      // {
      //   path: 'create',
      //   component: CreateCinemaComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
