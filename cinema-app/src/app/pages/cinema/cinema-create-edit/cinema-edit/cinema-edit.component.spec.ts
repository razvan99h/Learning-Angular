import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CinemaEditComponent } from './cinema-edit.component';

describe('CinemaEditComponent', () => {
  let component: CinemaEditComponent;
  let fixture: ComponentFixture<CinemaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CinemaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CinemaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
