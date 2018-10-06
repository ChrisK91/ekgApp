import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatCardModule, MatDividerModule, MatIconModule, MatToolbarModule, MatButtonToggleModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngstack/translate';

import { AppComponent } from './app.component';
import { LagetypenComponent } from './lagetypen/lagetypen.component';

export function setupTranslateService(service: TranslateService) {
  return () => service.load();
}

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
    MatIconModule,
    MatToolbarModule,
    MatButtonToggleModule,

    HttpClientModule,
    TranslateModule.forRoot({
      activeLang: 'en'
    })
  ],
  providers: [
    // needed to load translation before application starts
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateService,
      deps: [TranslateService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
