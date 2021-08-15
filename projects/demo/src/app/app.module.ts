import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OpenfinService } from './providers/openfin.service';
import { AppComponent } from './app.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ChildWindowComponent } from './child-window/child-window.component';

@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    ChildWindowComponent,
  ],
  imports: [
    MatDividerModule,
    MatRadioModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
  ],
  providers: [OpenfinService],
  bootstrap: [AppComponent],
})
export class AppModule {}
