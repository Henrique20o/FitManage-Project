import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../services/auth-service';
import { AlunosService } from '../../services/alunos-service';
import { FinanceiroService } from '../../services/financeiro-service';
import { PlanosService } from '../../services/planos-service';

import { AlunoApi } from '../../models/aluno-api';
import { PagamentoApi } from '../../models/pagamento-api';
import { PlanoApi } from '../../models/planos-api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar, CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // dados carregados da API (já filtrados por academia)
  private alunos: AlunoApi[] = [];
  private planos: PlanoApi[] = [];
  private pagamentos: PagamentoApi[] = [];

  private idAcademia: number | null = null;

  // indicadores usados no HTML
  faturamentoGeral = 0;
  ticketMedio = 0;
  numeroAlunos = 0;
  planoMaisVendido = '-';

  constructor(
    private authService: AuthService,
    private alunosService: AlunosService,
    private financeiroService: FinanceiroService,
    private planosService: PlanosService,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================
  // ciclo de vida
  // ==========================
  ngOnInit(): void {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.warn('Dashboard: nenhum usuário logado encontrado.');
      return;
    }

    this.idAcademia = Number(usuarioLogado.id);
    console.log('Dashboard - idAcademia logado:', this.idAcademia);

    this.carregarAlunos();
    this.carregarPlanos();
    this.carregarPagamentos();
  }

  // ==========================
  // Cargas da API (json-server)
  // ==========================
  private carregarAlunos(): void {
    if (this.idAcademia == null) return;

    this.alunosService.obterAlunos().subscribe({
      next: (data: AlunoApi[]) => {
        console.log('Dashboard - alunos da API:', data);

        this.alunos = (data || []).filter(
          (aluno) => Number(aluno.idAcademia) === this.idAcademia
        );

        console.log('Dashboard - alunos filtrados:', this.alunos);

        this.atualizarIndicadores();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Dashboard - erro ao carregar alunos:', err);
        this.alunos = [];
        this.atualizarIndicadores();
        this.cdr.markForCheck();
      },
    });
  }

  private carregarPlanos(): void {
    if (this.idAcademia == null) return;

    this.planosService.obterPlanos().subscribe({
      next: (data: PlanoApi[]) => {
        console.log('Dashboard - planos da API:', data);

        this.planos = (data || []).filter(
          (plano) => Number(plano.idAcademia) === this.idAcademia
        );

        console.log('Dashboard - planos filtrados:', this.planos);

        this.atualizarIndicadores();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Dashboard - erro ao carregar planos:', err);
        this.planos = [];
        this.atualizarIndicadores();
        this.cdr.markForCheck();
      },
    });
  }

  private carregarPagamentos(): void {
    if (this.idAcademia == null) return;

    this.financeiroService.obterPagamentos().subscribe({
      next: (data: PagamentoApi[]) => {
        console.log('Dashboard - pagamentos da API:', data);

        // filtra só os pagamentos dessa academia
        this.pagamentos = (data || []).filter(
          (pagamento) => Number(pagamento.idAcademia) === this.idAcademia
        );

        console.log(
          'Dashboard - pagamentos filtrados:',
          this.pagamentos
        );

        this.atualizarIndicadores();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Dashboard - erro ao carregar pagamentos:', err);
        this.pagamentos = [];
        this.atualizarIndicadores();
        this.cdr.markForCheck();
      },
    });
  }

  // ==========================
  // Cálculo dos indicadores
  // ==========================
  private atualizarIndicadores(): void {
    if (this.idAcademia == null) return;

    // 1) quantidade de alunos
    this.numeroAlunos = this.alunos.length;

    // 2) faturamento geral = soma dos pagamentos dessa academia
    this.faturamentoGeral = this.pagamentos.reduce((total, p) => {
      // garante que será número, mesmo que venha como string
      const v = Number(p.valor ?? 0);
      return isNaN(v) ? total : total + v;
    }, 0);

    console.log(
      'Dashboard - faturamentoGeral calculado:',
      this.faturamentoGeral
    );

    // 3) ticket médio = faturamento / quantidade de pagamentos
    const qtdPagamentos = this.pagamentos.length;
    this.ticketMedio =
      qtdPagamentos > 0 ? this.faturamentoGeral / qtdPagamentos : 0;

    console.log('Dashboard - ticketMedio calculado:', this.ticketMedio);

    // 4) plano mais vendido (mais alunos vinculados)
    const contagemPorPlano = new Map<any, number>();

    for (const aluno of this.alunos) {
      if (aluno.idPlano != null) {
        const chave = aluno.idPlano;
        const atual = contagemPorPlano.get(chave) ?? 0;
        contagemPorPlano.set(chave, atual + 1);
      }
    }

    if (contagemPorPlano.size === 0) {
      this.planoMaisVendido = 'Nenhum plano vendido';
    } else {
      let chaveMaisVendido: any = null;
      let maiorQtd = 0;

      contagemPorPlano.forEach((qtd, chave) => {
        if (qtd > maiorQtd) {
          maiorQtd = qtd;
          chaveMaisVendido = chave;
        }
      });

      // aqui a chave é o idPlano que está no aluno;
      // se seus ids de plano forem string no JSON,
      // é só garantir que seja o mesmo valor aqui
      const plano = this.planos.find((p: any) => p.id === chaveMaisVendido);
      this.planoMaisVendido = plano?.titulo ?? 'Plano não encontrado';
    }

    console.log('Dashboard - planoMaisVendido:', this.planoMaisVendido);
  }
}
