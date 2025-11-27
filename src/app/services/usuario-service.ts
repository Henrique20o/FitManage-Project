import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/academias';

  constructor(private http: HttpClient) {}

  cadastrar(academia: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, academia);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorUsuario(usuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?usuario=${usuario}`);
  }
}
