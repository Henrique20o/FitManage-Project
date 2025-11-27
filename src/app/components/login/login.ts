import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  usuario: string = '';
  senha: string = '';
  erro: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin(): void {
    this.erro = '';

    this.authService.login(this.usuario, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.erro = err.message;
        alert(this.erro);
      }
    });
  }
}
