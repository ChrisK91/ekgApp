import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatCardModule, MatDividerModule, MatIconModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LagetypenComponent } from './lagetypen/lagetypen.component';

@NgModule({
  declarations: [
    AppComponent,
    LagetypenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    
    MatSliderModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
