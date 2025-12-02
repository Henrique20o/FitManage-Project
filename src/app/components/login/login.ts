import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserCredentials } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: UserCredentials = {
    login: '',
    senha: ''
  };

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.login || !this.credentials.senha) {
      alert('Por favor, preencha o login e a senha.');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (success) => {
        if (success) {
          alert(`Login bem-sucedido! Bem-vindo(a), ${this.authService.getCurrentUser()?.nome}!`);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Credenciais inválidas. Tente novamente.');
        }
      },
      error: () => {
        alert('Erro ao tentar conectar com o servidor (verifique se o JSON Server está rodando).');
      }
    });
  }
}