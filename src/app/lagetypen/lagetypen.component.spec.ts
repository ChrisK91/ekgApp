import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LagetypenComponent } from './lagetypen.component';

describe('LagetypenComponent', () => {
  let component: LagetypenComponent;
  let fixture: ComponentFixture<LagetypenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LagetypenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LagetypenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
