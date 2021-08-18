import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SecondaryWindowComponent} from './secondary-window.component';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('MainWindowComponent', () => {
  let component: SecondaryWindowComponent;
  let fixture: ComponentFixture<SecondaryWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SecondaryWindowComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
