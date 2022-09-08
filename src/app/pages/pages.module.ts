import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainComponent } from './components/main/main.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [HomepageComponent, NotFoundComponent, MainComponent],
  exports: [HomepageComponent, NotFoundComponent],
  imports: [CommonModule, AppRoutingModule],
})
export class PagesModule {}
