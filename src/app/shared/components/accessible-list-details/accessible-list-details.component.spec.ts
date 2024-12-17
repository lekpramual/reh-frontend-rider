import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibleListDetailsComponent } from './accessible-list-details.component';

describe('AccessibleListDetailsComponent', () => {
  let component: AccessibleListDetailsComponent;
  let fixture: ComponentFixture<AccessibleListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessibleListDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessibleListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
