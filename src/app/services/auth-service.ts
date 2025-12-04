// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CadastroApi } from '../models/cadastro-api';

export interface UserCredentials {
  login: string;
  senha: string;
}

const API_URL = 'http://localhost:3000/academia'; 
const USER_KEY = 'currentUser'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
   
  login(credentials: UserCredentials): Observable<boolean> {
    return this.http.get<CadastroApi[]>(API_URL).pipe(
      map((usuarios) => {
        const user = usuarios.find((u) => u.login === credentials.login && u.senha === credentials.senha);

        if (user) {
          const sessionData = { 
            id: user.id,
            nome: user.nomePessoal,
            nomeAcademia: user.nomeAcademia,
          };
          this.setSession(sessionData);
          return true; 
        }
        return false; 
      }),
      catchError((error) => {
        console.error('Erro ao conectar com a API de academias:', error);
        return of(false);
      })
    );
  }


  private setSession(sessionData: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(sessionData));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(USER_KEY);
  }

  getCurrentUser(): any | null {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']); 
  }
}