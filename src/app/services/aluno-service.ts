import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlunosApi } from '../models/alunos-api';

@Injectable({
  providedIn: 'root',
})
export class AlunosService {
  private apiUrl = 'http://localhost:3000/alunos';

  constructor(private http: HttpClient) {}

  criarAluno(aluno: AlunosApi): Observable<AlunosApi> {
    return this.http.post<AlunosApi>(this.apiUrl, aluno);
  }
  obterAlunos(): Observable<AlunosApi[]> {
    return this.http.get<AlunosApi[]>(this.apiUrl);
  }
}
