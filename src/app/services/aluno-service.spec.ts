import { TestBed } from '@angular/core/testing';

import { AlunosService } from './aluno-service';
import { Alunos } from '../components/alunos/alunos';

describe('AlunosService', () => {
  let service: AlunosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlunosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
