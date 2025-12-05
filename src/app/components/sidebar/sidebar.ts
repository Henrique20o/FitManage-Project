import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);

  // nome exibido no rodapé do menu
  nomeAcademia: string = 'Minha academia';

  ngOnInit(): void {
    const usuarioLogado = this.authService.getCurrentUser();

    if (usuarioLogado) {
      // no seu db.json o campo se chama "nomeAcademia"
      this.nomeAcademia = usuarioLogado.nomeAcademia || 'Minha academia';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
