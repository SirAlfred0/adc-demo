import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerCustomViewComponent } from './scheduler-custom-view.component';

describe('SchedulerCustomViewComponent', () => {
  let component: SchedulerCustomViewComponent;
  let fixture: ComponentFixture<SchedulerCustomViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulerCustomViewComponent]
    });
    fixture = TestBed.createComponent(SchedulerCustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
