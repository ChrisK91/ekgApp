import { Component, OnInit } from '@angular/core';
import { TitleService, TranslateService } from '@ngstack/translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'EKG Lagetypen';

  constructor(private titleService: TitleService, private translate: TranslateService) {}

  ngOnInit() {
    this.titleService.setTitle('TITLE');
  }

  changeLang(lang: string) {
    this.translate.activeLang = lang;
  }
}
