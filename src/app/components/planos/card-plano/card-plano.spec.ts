import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPlano } from './card-plano';

describe('CardPlano', () => {
  let component: CardPlano;
  let fixture: ComponentFixture<CardPlano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPlano]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPlano);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
