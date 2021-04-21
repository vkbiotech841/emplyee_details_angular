import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailByIdComponent } from './employee-detail-by-id.component';

describe('EmployeeDetailByIdComponent', () => {
  let component: EmployeeDetailByIdComponent;
  let fixture: ComponentFixture<EmployeeDetailByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDetailByIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
