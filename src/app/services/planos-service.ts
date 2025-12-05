import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoApi } from '../models/planos-api';

@Injectable({
  providedIn: 'root',
})
export class PlanosService {
  private apiUrl = 'http://localhost:3000/planos';

  constructor(private http: HttpClient) {}

  criarPlano(plano: PlanoApi): Observable<PlanoApi> {
    return this.http.post<PlanoApi>(this.apiUrl, plano);
  }

  obterPlanos(): Observable<PlanoApi[]> {
    return this.http.get<PlanoApi[]>(this.apiUrl);
  }

  atualizarPlano(plano: PlanoApi): Observable<PlanoApi> {
    if (!plano.id) {
      throw new Error('Plano sem ID não pode ser atualizado');
    }
    const url = `${this.apiUrl}/${plano.id}`;
    return this.http.put<PlanoApi>(url, plano);
  }

  deletarPlano(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
