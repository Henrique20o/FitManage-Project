import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CardPlano } from './card-plano/card-plano';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';      // 👈 ajusta o caminho se no seu projeto for diferente
import { PlanosService } from '../../services/planos-service';  // 👈 idem
import { PlanoApi } from '../../models/planos-api';             // 👈 idem

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [Sidebar, CardPlano, NgFor, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './planos.html',
  styleUrl: './planos.css',
})

export class Planos implements OnInit {
  // lista usada no *ngFor do HTML
  planos: Array<{ titulo: string; descricao: string; valor: string }> = [];

  // mesmo nome usado no *ngIf do modal
  modalPlanoAberto = false;

  // mesmo objeto usado no [(ngModel)] do formulário
  novoPlano = {
    titulo: '',
    descricao: '',
    valor: '',
  };

  constructor(
    private authService: AuthService,
    private planosService: PlanosService,
    private cdr: ChangeDetectorRef
  ) {}

  // =============================
  // ciclo de vida
  // =============================
  ngOnInit(): void {
    this.carregarPlanos();
  }

  // =============================
  // carrega planos do usuário logado
  // =============================
  private carregarPlanos(): void {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado (localStorage vazio).');
      this.planos = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);
    console.log('Usuário logado:', usuarioLogado);

    this.planosService.obterPlanos().subscribe({
      next: (data: PlanoApi[]) => {
        console.log('Planos retornados da API (brutos):', data);

        // 🔎 filtra só os planos dessa academia
        const filtrados = (data || []).filter((plano) => {
          return Number(plano.idAcademia) === idAcademia;
        });

        console.log('Planos filtrados por idAcademia =', idAcademia, filtrados);

        // 👇 AQUI tratamos valor = null/undefined pra não dar erro no toString
        this.planos = filtrados.map((plano) => {
          const valorTratado = plano.valor ? `R$${plano.valor.toFixed(2).toString().replaceAll('.', ',')}` : 'Grátis'; // se for null/undefined vira 0
          return {
            titulo: plano.titulo ?? '',
            descricao: plano.descricao ?? '',
            valor: valorTratado.toString(), // usa valorNovo convertido para string
          };
        });

        this.cdr.markForCheck(); // Força a detecção de mudanças
      },
      error: (err) => {
        console.error('Erro ao carregar planos:', err);
        this.planos = [];
      },
    });
  }

  // =============================
  // ações do modal
  // =============================
  abrirModalPlano() {
    this.modalPlanoAberto = true;
  }

  fecharModalPlano() {
    this.modalPlanoAberto = false;
    this.novoPlano = { titulo: '', descricao: '', valor: '' };
  }

  salvarPlano() {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.error('Tentativa de salvar plano sem usuário logado.');
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    const payload: PlanoApi = {
      titulo: this.novoPlano.titulo,
      descricao: this.novoPlano.descricao,
      // se o campo ficar vazio, manda 0 pra não ficar null no banco
      valor: this.novoPlano.valor ? Number(this.novoPlano.valor) : 0,
      idAcademia: idAcademia,
    };

    console.log('Salvando plano com payload:', payload);

    this.planosService.criarPlano(payload).subscribe({
      next: () => {
        // depois de salvar, recarrega a lista já filtrando pelo usuário
        this.carregarPlanos();
        this.fecharModalPlano();
      },
      error: (err) => {
        console.error('Erro ao salvar plano:', err);
        this.fecharModalPlano();
      },
    });
  }
}
