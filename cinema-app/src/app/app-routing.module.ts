import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MovieDetailsResolverService } from './pages/movie-details/movie-details-resolver.service';
import { PageUnavailableComponent } from './shared/components/page-unavailable/page-unavailable.component';


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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
