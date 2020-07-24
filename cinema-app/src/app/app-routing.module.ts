import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MovieDetailsResolverService } from './pages/movie-details/movie-details-resolver.service';
import { PageUnavailableComponent } from './shared/components/page-unavailable/page-unavailable.component';
import { CinemaListComponent } from './pages/cinema/cinema-list/cinema-list.component';
import { CinemaComponent } from './pages/cinema/cinema.component';
import { CinemaListResolverService } from './pages/cinema/cinema-list/cinema-list-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'movie/:id',
    component: MovieDetailsComponent,
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
        component: CinemaListComponent,
        resolve: {
          cinemaList: CinemaListResolverService
        }
      },
      // {
      //   path: 'create',
      //   component: CreateCinemaComponent
      // }
    ]
  },
  {
    path: '**',
    component: PageUnavailableComponent,
  },
  {
    path: 'unavailable',
    component: PageUnavailableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
