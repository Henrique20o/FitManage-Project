import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlunoApi } from '../models/aluno-api';

@Injectable({
  providedIn: 'root',
})
export class AlunosService {
  private apiUrl = 'http://localhost:3000/alunos';

  constructor(private http: HttpClient) {}

  criarAluno(aluno: AlunoApi): Observable<AlunoApi> {
    return this.http.post<AlunoApi>(this.apiUrl, aluno);
  }

  obterAlunos(): Observable<AlunoApi[]> {
    return this.http.get<AlunoApi[]>(this.apiUrl);
  }

  atualizarAluno(aluno: AlunoApi): Observable<AlunoApi> {
    if (!aluno.id) {
      throw new Error('Aluno sem ID não pode ser atualizado');
    }
    const url = `${this.apiUrl}/${aluno.id}`;
    return this.http.put<AlunoApi>(url, aluno);
  }

  deletarAluno(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
