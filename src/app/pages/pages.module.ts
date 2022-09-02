import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';

@NgModule({
  declarations: [HomepageComponent],
  exports: [HomepageComponent],
  imports: [CommonModule],
})
export class PagesModule {}
