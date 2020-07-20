import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSliderModule} from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { NavComponent } from './components/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { PageUnavailableComponent } from './components/page-unavailable/page-unavailable.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavComponent,
    PageUnavailableComponent
  ],
  exports: [
    NavComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
  ]
})
export class SharedModule { }
