import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CadastroApi } from '../models/cadastro-api';

@Injectable({
  providedIn: 'root',
})

export class CadastroService {
  private apiUrl = 'http://localhost:3000/academia'; 

  constructor(private http: HttpClient) {}

  criarCadastro(cadastro: CadastroApi): Observable<CadastroApi> {
    return this.http.post<CadastroApi>(this.apiUrl, cadastro);
  }
}
