import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [HomepageComponent, NotFoundComponent],
  exports: [HomepageComponent, NotFoundComponent],
  imports: [CommonModule],
})
export class PagesModule {}
