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
}
