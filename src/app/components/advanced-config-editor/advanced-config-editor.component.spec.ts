import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedConfigEditorComponent } from './advanced-config-editor.component';

describe('AdvancedConfigEditorComponent', () => {
  let component: AdvancedConfigEditorComponent;
  let fixture: ComponentFixture<AdvancedConfigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedConfigEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
