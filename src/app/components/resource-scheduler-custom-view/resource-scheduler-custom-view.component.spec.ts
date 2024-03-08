import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSchedulerCustomViewComponent } from './resource-scheduler-custom-view.component';

describe('ResourceSchedulerCustomViewComponent', () => {
  let component: ResourceSchedulerCustomViewComponent;
  let fixture: ComponentFixture<ResourceSchedulerCustomViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceSchedulerCustomViewComponent]
    });
    fixture = TestBed.createComponent(ResourceSchedulerCustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
