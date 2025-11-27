import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/usuarios';

  private usuarioLogadoSubject = new BehaviorSubject<any>(null);
  usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(usuario: string, senha: string) {
    return this.http.get<any[]>(`${this.apiUrl}?usuario=${usuario}`).pipe(
      map(usuarios => {
        if (usuarios.length === 0) {
          throw new Error('Usuário não encontrado');
        }

        const usuarioEncontrado = usuarios[0];

        if (usuarioEncontrado.senha !== senha) {
          throw new Error('Senha incorreta');
        }

        this.usuarioLogadoSubject.next(usuarioEncontrado);
        return usuarioEncontrado;
      })
    );
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.value;
  }

  logout() {
    this.usuarioLogadoSubject.next(null);
  }

  isLogado() {
    return this.usuarioLogadoSubject.value != null;
  }
}
