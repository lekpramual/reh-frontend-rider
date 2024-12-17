import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedChipComponent } from './proceed-chip.component';

describe('ProceedChipComponent', () => {
  let component: ProceedChipComponent;
  let fixture: ComponentFixture<ProceedChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProceedChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProceedChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
