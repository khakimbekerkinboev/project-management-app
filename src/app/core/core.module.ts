import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ConfirmDeleteComponent],
  exports: [HeaderComponent, FooterComponent, ConfirmDeleteComponent],
  imports: [CommonModule, AppRoutingModule, TranslateModule],
})
export class CoreModule {}
