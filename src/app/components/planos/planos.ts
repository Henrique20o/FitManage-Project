import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CardPlano } from './card-plano/card-plano';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';
import { PlanosService } from '../../services/planos-service';
import { PlanoApi } from '../../models/planos-api';

type PlanoLista = {
  id: number;
  titulo: string;
  descricao: string;
  valor: string;       // texto formatado para tela (R$...)
  valorNumero: number; // valor numérico vindo da API
};

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [Sidebar, CardPlano, NgFor, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './planos.html',
  styleUrl: './planos.css',
})
export class Planos implements OnInit {
  planos: PlanoLista[] = [];

  // modal de cadastro/edição
  modalPlanoAberto = false;
  isEditMode = false;
  planoEditandoId: number | null = null;

  // modal de confirmação de exclusão
  modalExcluirAberto = false;
  planoParaExcluir: PlanoLista | null = null;

  // objeto usado no formulário
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

  ngOnInit(): void {
    this.carregarPlanos();
  }

  // ==========================
  // Carregar planos da API
  // ==========================
  private carregarPlanos(): void {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado (localStorage vazio).');
      this.planos = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    this.planosService.obterPlanos().subscribe({
      next: (data: PlanoApi[]) => {
        const filtrados = (data || []).filter(
          (plano) => Number(plano.idAcademia) === idAcademia
        );

        this.planos = filtrados.map((plano) => {
          const valorNumero = plano.valor ?? 0;
          const valorFormatado =
            valorNumero && valorNumero !== 0
              ? `R$${valorNumero.toFixed(2).toString().replace('.', ',')}`
              : 'Grátis';

          return {
            id: plano.id ?? 0,
            titulo: plano.titulo ?? '',
            descricao: plano.descricao ?? '',
            valor: valorFormatado,
            valorNumero: valorNumero,
          };
        });

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar planos:', err);
        this.planos = [];
      },
    });
  }

  // ==========================
  // Modal: criar / editar
  // ==========================
  abrirModalPlano() {
    this.isEditMode = false;
    this.planoEditandoId = null;
    this.modalPlanoAberto = true;
    this.novoPlano = { titulo: '', descricao: '', valor: '' };
  }

  abrirModalEditar(plano: PlanoLista) {
    this.isEditMode = true;
    this.planoEditandoId = plano.id;
    this.modalPlanoAberto = true;

    this.novoPlano = {
      titulo: plano.titulo,
      descricao: plano.descricao,
      valor: plano.valorNumero
        ? plano.valorNumero.toString().replace('.', ',')
        : '',
    };
  }

  fecharModalPlano() {
    this.modalPlanoAberto = false;
    this.isEditMode = false;
    this.planoEditandoId = null;
    this.novoPlano = { titulo: '', descricao: '', valor: '' };
  }

  // ==========================
  // Salvar (criar ou editar)
  // ==========================
  salvarPlano() {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.error('Tentativa de salvar plano sem usuário logado.');
      return;
    }

    const idAcademia = Number(usuarioLogado.id);
    const valorNumber = this.novoPlano.valor
      ? Number(this.novoPlano.valor.toString().replace(',', '.'))
      : 0;

    if (!this.isEditMode) {
      // CRIAR
      const payload: PlanoApi = {
        titulo: this.novoPlano.titulo,
        descricao: this.novoPlano.descricao,
        valor: valorNumber,
        idAcademia: idAcademia,
      };

      this.planosService.criarPlano(payload).subscribe({
        next: () => {
          this.carregarPlanos();
          this.fecharModalPlano();
        },
        error: (err) => {
          console.error('Erro ao salvar plano:', err);
          this.fecharModalPlano();
        },
      });
    } else {
      // EDITAR
      if (!this.planoEditandoId) {
        console.error('Nenhum ID de plano para editar.');
        return;
      }

      const payload: PlanoApi = {
        id: this.planoEditandoId,
        titulo: this.novoPlano.titulo,
        descricao: this.novoPlano.descricao,
        valor: valorNumber,
        idAcademia: idAcademia,
      };

      this.planosService.atualizarPlano(payload).subscribe({
        next: () => {
          this.carregarPlanos();
          this.fecharModalPlano();
        },
        error: (err) => {
          console.error('Erro ao atualizar plano:', err);
          this.fecharModalPlano();
        },
      });
    }
  }

  // ==========================
  // Exclusão com modal
  // ==========================
  solicitarExclusao(plano: PlanoLista) {
    this.planoParaExcluir = plano;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluir() {
    this.modalExcluirAberto = false;
    this.planoParaExcluir = null;
  }

  confirmarExclusao() {
    if (!this.planoParaExcluir || !this.planoParaExcluir.id) {
      console.error('Nenhum plano selecionado para exclusão.');
      return;
    }

    const id = this.planoParaExcluir.id;

    this.planosService.deletarPlano(id).subscribe({
      next: () => {
        this.carregarPlanos();
        this.fecharModalExcluir();
      },
      error: (err) => {
        console.error('Erro ao excluir plano:', err);
        this.fecharModalExcluir();
      },
    });
  }
}
