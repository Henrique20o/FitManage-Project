import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagamentoApi } from '../models/pagamento-api';

@Injectable({
  providedIn: 'root',
})
export class FinanceiroService {
  private apiUrl = 'http://localhost:3000/pagamentos'; // coleção "pagamentos" no db.json

  constructor(private http: HttpClient) {}

  criarPagamento(p: PagamentoApi): Observable<PagamentoApi> {
    return this.http.post<PagamentoApi>(this.apiUrl, p);
  }

  obterPagamentos(): Observable<PagamentoApi[]> {
    return this.http.get<PagamentoApi[]>(this.apiUrl);
  }

  atualizarPagamento(p: PagamentoApi): Observable<PagamentoApi> {
    if (!p.id) {
      throw new Error('Pagamento sem ID não pode ser atualizado');
    }
    const url = `${this.apiUrl}/${p.id}`;
    return this.http.put<PagamentoApi>(url, p);
  }

  deletarPagamento(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
