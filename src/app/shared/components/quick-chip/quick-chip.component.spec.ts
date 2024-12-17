import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickChipComponent } from './quick-chip.component';

describe('QuickChipComponent', () => {
  let component: QuickChipComponent;
  let fixture: ComponentFixture<QuickChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
