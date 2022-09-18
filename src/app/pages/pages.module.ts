import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainComponent } from './components/main/main.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { BoardComponent } from './components/board/board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    HomepageComponent,
    NotFoundComponent,
    MainComponent,
    BoardComponent,
  ],
  exports: [HomepageComponent, NotFoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    DragDropModule,
    TranslateModule,
  ],
})
export class PagesModule {}
