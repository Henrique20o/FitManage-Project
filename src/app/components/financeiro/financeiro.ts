import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CardFinanceiro } from './card-financeiro/card-financeiro';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../services/auth-service';
import { AlunosService } from '../../services/alunos-service';
import { PlanosService } from '../../services/planos-service';
import { FinanceiroService } from '../../services/financeiro-service';

import { AlunoApi } from '../../models/aluno-api';
import { PlanoApi } from '../../models/planos-api';
import { PagamentoApi } from '../../models/pagamento-api';

type PagamentoLista = {
  id: number;
  aluno: string;
  dataPagamento: string;
  valor: string;       // formatado (R$...)
  valorNumero: number; // numérico
  mesReferencia: string;
  anoReferencia: string;
  idAluno: number;
};

type AlunoResumo = {
  id: number;
  nome: string;
  idPlano: number | null;
};

type PlanoResumo = {
  id: number;
  titulo: string;
  valorNumero: number;
};

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [Sidebar, CardFinanceiro, NgFor, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css',
})
export class Financeiro implements OnInit {
  // lista usada no *ngFor
  pagamentos: PagamentoLista[] = [];

  // auxiliares
  alunosDisponiveis: AlunoResumo[] = [];
  planosDisponiveis: PlanoResumo[] = [];

  // controle do modal de registro/edição
  modalPagamentoAberto = false;
  isEditMode = false;
  pagamentoEditandoId: number | null = null;

  // controle do modal de exclusão
  modalExcluirAberto = false;
  pagamentoParaExcluir: PagamentoLista | null = null;

  // objeto usado no formulário
  novoPagamento = {
    idAluno: null as number | null,
    dataPagamento: '',
    valor: '',
    mesReferencia: '',
    anoReferencia: '',
  };

  // lista de meses para o select
  meses = [
    { valor: '01', nome: 'Janeiro' },
    { valor: '02', nome: 'Fevereiro' },
    { valor: '03', nome: 'Março' },
    { valor: '04', nome: 'Abril' },
    { valor: '05', nome: 'Maio' },
    { valor: '06', nome: 'Junho' },
    { valor: '07', nome: 'Julho' },
    { valor: '08', nome: 'Agosto' },
    { valor: '09', nome: 'Setembro' },
    { valor: '10', nome: 'Outubro' },
    { valor: '11', nome: 'Novembro' },
    { valor: '12', nome: 'Dezembro' },
  ];

  constructor(
    private authService: AuthService,
    private alunosService: AlunosService,
    private planosService: PlanosService,
    private financeiroService: FinanceiroService,
    private cdr: ChangeDetectorRef
  ) {}

  // =============================
  // ciclo de vida
  // =============================
  ngOnInit(): void {
    this.carregarAlunos();
    this.carregarPlanos();
    this.carregarPagamentos();
  }

  // =============================
  // helpers
  // =============================
  private formatarData(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private formatarValor(valor: number): string {
    if (!valor || valor === 0) {
      return 'R$0,00';
    }
    return `R$${valor.toFixed(2).toString().replace('.', ',')}`;
  }

  // =============================
  // carrega alunos da academia logada
  // =============================
  private carregarAlunos(): void {
    const usuarioLogado = this.authService.getCurrentUser();
    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado.');
      this.alunosDisponiveis = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    this.alunosService.obterAlunos().subscribe({
      next: (data: AlunoApi[]) => {
        const filtrados = (data || []).filter(
          (a) => Number(a.idAcademia) === idAcademia
        );

        this.alunosDisponiveis = filtrados.map((a) => ({
          id: a.id ?? 0,
          nome: a.nome,
          idPlano: a.idPlano ?? null,
        }));

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar alunos (financeiro):', err);
        this.alunosDisponiveis = [];
      },
    });
  }

  // =============================
  // carrega planos da academia logada
  // =============================
  private carregarPlanos(): void {
    const usuarioLogado = this.authService.getCurrentUser();
    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado.');
      this.planosDisponiveis = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    this.planosService.obterPlanos().subscribe({
      next: (data: PlanoApi[]) => {
        const filtrados = (data || []).filter(
          (p) => Number(p.idAcademia) === idAcademia
        );

        this.planosDisponiveis = filtrados.map((p) => ({
          id: p.id ?? 0,
          titulo: p.titulo ?? '',
          valorNumero: p.valor ?? 0,
        }));

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar planos (financeiro):', err);
        this.planosDisponiveis = [];
      },
    });
  }

  private obterValorPlanoPorAluno(idAluno: number | null): number {
    if (!idAluno) return 0;
    const aluno = this.alunosDisponiveis.find((a) => a.id === idAluno);
    if (!aluno || !aluno.idPlano) return 0;
    const plano = this.planosDisponiveis.find((p) => p.id === aluno.idPlano);
    return plano?.valorNumero ?? 0;
  }

  private obterNomeAluno(idAluno: number): string {
    const aluno = this.alunosDisponiveis.find((a) => a.id === idAluno);
    return aluno?.nome ?? '';
  }

  // =============================
  // carrega pagamentos da academia logada
  // =============================
  private carregarPagamentos(): void {
    const usuarioLogado = this.authService.getCurrentUser();
    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado.');
      this.pagamentos = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    this.financeiroService.obterPagamentos().subscribe({
      next: (data: PagamentoApi[]) => {
        const filtrados = (data || []).filter(
          (p) => Number(p.idAcademia) === idAcademia
        );

        this.pagamentos = filtrados.map((p) => {
          const valorNumero = p.valor ?? 0;
          return {
            id: p.id ?? 0,
            aluno: this.obterNomeAluno(p.idAluno),
            dataPagamento: p.dataPagamento,
            valor: this.formatarValor(valorNumero),
            valorNumero,
            mesReferencia: p.mesReferencia,
            anoReferencia: String(p.anoReferencia),
            idAluno: p.idAluno,
          };
        });

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar pagamentos:', err);
        this.pagamentos = [];
      },
    });
  }

  // =============================
  // modal de registro / edição
  // =============================
  abrirModalPagamento() {
    this.isEditMode = false;
    this.pagamentoEditandoId = null;
    this.modalPagamentoAberto = true;

    const hoje = new Date();

    this.novoPagamento = {
      idAluno: null,
      dataPagamento: this.formatarData(hoje),         // vem do sistema
      valor: '',                                      // será calculado ao escolher o aluno
      mesReferencia: String(hoje.getMonth() + 1).padStart(2, '0'),
      anoReferencia: String(hoje.getFullYear()),      // vem do sistema
    };
  }

  abrirModalEditar(p: PagamentoLista) {
    this.isEditMode = true;
    this.pagamentoEditandoId = p.id;
    this.modalPagamentoAberto = true;

    this.novoPagamento = {
      idAluno: p.idAluno,
      dataPagamento: p.dataPagamento,
      valor: this.formatarValor(p.valorNumero),
      mesReferencia: p.mesReferencia,
      anoReferencia: p.anoReferencia,
    };
  }

  fecharModalPagamento() {
    this.modalPagamentoAberto = false;
    this.isEditMode = false;
    this.pagamentoEditandoId = null;
    this.novoPagamento = {
      idAluno: null,
      dataPagamento: '',
      valor: '',
      mesReferencia: '',
      anoReferencia: '',
    };
  }

  onAlunoChange(idAluno: number | null) {
    this.novoPagamento.idAluno = idAluno;
    const valorNumero = this.obterValorPlanoPorAluno(idAluno);
    this.novoPagamento.valor = this.formatarValor(valorNumero);
  }

  salvarPagamento() {
    const usuarioLogado = this.authService.getCurrentUser();
    if (!usuarioLogado) {
      console.error('Tentativa de salvar pagamento sem usuário logado.');
      return;
    }

    const idAcademia = Number(usuarioLogado.id);
    const hoje = new Date();
    const dataPagamento = this.formatarData(hoje);         // sempre do sistema
    const anoReferenciaNumber = Number(this.novoPagamento.anoReferencia || hoje.getFullYear());
    const mesRef = this.novoPagamento.mesReferencia;
    const valorNumero = this.obterValorPlanoPorAluno(this.novoPagamento.idAluno);

    if (!this.novoPagamento.idAluno) {
      console.error('Selecione um aluno antes de salvar o pagamento.');
      return;
    }

    const payload: PagamentoApi = {
      id: this.isEditMode ? this.pagamentoEditandoId ?? undefined : undefined,
      idAluno: this.novoPagamento.idAluno,
      idAcademia,
      dataPagamento,
      mesReferencia: mesRef,
      anoReferencia: anoReferenciaNumber,
      valor: valorNumero,
    };

    console.log(
      this.isEditMode ? 'Atualizando pagamento:' : 'Criando pagamento:',
      payload
    );

    const req$ = this.isEditMode
      ? this.financeiroService.atualizarPagamento(payload)
      : this.financeiroService.criarPagamento(payload);

    req$.subscribe({
      next: () => {
        this.carregarPagamentos();
        this.fecharModalPagamento();
      },
      error: (err) => {
        console.error('Erro ao salvar pagamento:', err);
        this.fecharModalPagamento();
      },
    });
  }

  // =============================
  // exclusão com modal
  // =============================
  solicitarExclusao(p: PagamentoLista) {
    this.pagamentoParaExcluir = p;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluir() {
    this.modalExcluirAberto = false;
    this.pagamentoParaExcluir = null;
  }

  confirmarExclusao() {
    if (!this.pagamentoParaExcluir?.id) {
      console.error('Nenhum pagamento selecionado para exclusão.');
      return;
    }

    const id = this.pagamentoParaExcluir.id;

    this.financeiroService.deletarPagamento(id).subscribe({
      next: () => {
        this.carregarPagamentos();
        this.fecharModalExcluir();
      },
      error: (err) => {
        console.error('Erro ao excluir pagamento:', err);
        this.fecharModalExcluir();
      },
    });
  }
}
