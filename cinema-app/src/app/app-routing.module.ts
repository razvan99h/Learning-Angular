import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'movie/:id', component: MovieDetailsComponent, children: [] },
  // TODO: citesc despre route resolve - ca sa dea pagina MovieDetailsComponent load doar cand are datele
];
// TODO: citesc despre guard-uri
// TODO: { path: '**', component: PageNotFound }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
