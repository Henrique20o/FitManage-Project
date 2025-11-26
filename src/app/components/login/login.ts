import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario: string = '';
  senha: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.usuario === 'admin' && this.senha === 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuário ou senha inválidos!');
    }
  }
}
