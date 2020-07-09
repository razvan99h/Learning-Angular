import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'movie/:id', component: MovieDetailsComponent, children: [] },

];
// TODO: { path: '**', component: PageNotFound }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
