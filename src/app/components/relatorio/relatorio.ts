import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../services/auth-service';
import { AlunosService } from '../../services/alunos-service';
import { FinanceiroService } from '../../services/financeiro-service';
import { PlanosService } from '../../services/planos-service';

import { AlunoApi } from '../../models/aluno-api';
import { PagamentoApi } from '../../models/pagamento-api';
import { PlanoApi } from '../../models/planos-api';

type LinhaInadimplente = {
  aluno: string;
  mesRef: string;      // "05", "06"...
  anoRef: number;
  vencimento: string;  // "10/05/2025"
  valor: string;       // "R$79,90"
};

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [Sidebar, NgFor, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css',
})
export class Relatorio implements OnInit {
  // lista de meses para o select
  meses = [
    { codigo: '01', nome: '01 - Janeiro' },
    { codigo: '02', nome: '02 - Fevereiro' },
    { codigo: '03', nome: '03 - Março' },
    { codigo: '04', nome: '04 - Abril' },
    { codigo: '05', nome: '05 - Maio' },
    { codigo: '06', nome: '06 - Junho' },
    { codigo: '07', nome: '07 - Julho' },
    { codigo: '08', nome: '08 - Agosto' },
    { codigo: '09', nome: '09 - Setembro' },
    { codigo: '10', nome: '10 - Outubro' },
    { codigo: '11', nome: '11 - Novembro' },
    { codigo: '12', nome: '12 - Dezembro' },
  ];

  anos = [2024, 2025];

  // valores selecionados nos selects
  mesSelecionado: string = '06';  // pode ajustar se quiser outro padrão
  anoSelecionado: number = 2025;

  // dados vindos da API (json-server)
  private idAcademia: number | null = null;
  private alunos: AlunoApi[] = [];
  private planos: PlanoApi[] = [];
  private pagamentos: PagamentoApi[] = [];

  // o que aparece na tabela
  inadimplentesFiltrados: LinhaInadimplente[] = [];

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
      console.warn('Relatorio: nenhum usuário logado encontrado.');
      return;
    }

    this.idAcademia = Number(usuarioLogado.id);
    console.log('Relatorio - idAcademia logado:', this.idAcademia);

    this.carregarAlunos();
    this.carregarPlanos();
    this.carregarPagamentos();
  }

  // ==========================
  // Cargas da API
  // ==========================
  private carregarAlunos(): void {
    if (this.idAcademia == null) return;

    this.alunosService.obterAlunos().subscribe({
      next: (data: AlunoApi[]) => {
        console.log('Relatorio - alunos da API:', data);

        this.alunos = (data || []).filter(
          (a) => Number(a.idAcademia) === this.idAcademia
        );

        console.log('Relatorio - alunos filtrados:', this.alunos);
        this.atualizarRelatorio();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Relatorio - erro ao carregar alunos:', err);
        this.alunos = [];
        this.atualizarRelatorio();
        this.cdr.markForCheck();
      },
    });
  }

  private carregarPlanos(): void {
    if (this.idAcademia == null) return;

    this.planosService.obterPlanos().subscribe({
      next: (data: PlanoApi[]) => {
        console.log('Relatorio - planos da API:', data);

        this.planos = (data || []).filter(
          (p) => Number(p.idAcademia) === this.idAcademia
        );

        console.log('Relatorio - planos filtrados:', this.planos);
        this.atualizarRelatorio();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Relatorio - erro ao carregar planos:', err);
        this.planos = [];
        this.atualizarRelatorio();
        this.cdr.markForCheck();
      },
    });
  }

  private carregarPagamentos(): void {
    if (this.idAcademia == null) return;

    this.financeiroService.obterPagamentos().subscribe({
      next: (data: PagamentoApi[]) => {
        console.log('Relatorio - pagamentos da API:', data);

        this.pagamentos = (data || []).filter(
          (p) => Number(p.idAcademia) === this.idAcademia
        );

        console.log('Relatorio - pagamentos filtrados:', this.pagamentos);
        this.atualizarRelatorio();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Relatorio - erro ao carregar pagamentos:', err);
        this.pagamentos = [];
        this.atualizarRelatorio();
        this.cdr.markForCheck();
      },
    });
  }

  // ==========================
  // Botão "Buscar"
  // ==========================
  onBuscar() {
    this.atualizarRelatorio();
  }

  // ==========================
  // Monta lista de inadimplentes
  // ==========================
  private atualizarRelatorio(): void {
    if (this.idAcademia == null) return;

    const mes = this.mesSelecionado;      // ex: "06"
    const ano = this.anoSelecionado;      // ex: 2025

    // alunos dessa academia
    const alunosAcademia = this.alunos.filter(
      (a) => Number(a.idAcademia) === this.idAcademia
    );

    // pagamentos da academia no mês/ano selecionado
    const pagamentosMes = this.pagamentos.filter(
      (p) =>
        Number(p.idAcademia) === this.idAcademia &&
        p.mesReferencia === mes &&
        p.anoReferencia === ano
    );

    // cria um conjunto com IDs dos alunos que PAGARAM
    const idsAlunosQuePagaram = new Set<number>();
    for (const pag of pagamentosMes) {
      if (pag.idAluno != null) {
        idsAlunosQuePagaram.add(pag.idAluno);
      }
    }

    const linhas: LinhaInadimplente[] = [];

    // quem não aparece em idsAlunosQuePagaram é inadimplente
    for (const aluno of alunosAcademia) {
      if (!aluno.id || idsAlunosQuePagaram.has(aluno.id)) {
        continue; // tem pagamento, não é inadimplente
      }

      // encontra o plano do aluno
      const plano = this.planos.find((p) => p.id === aluno.idPlano);
      const valorNumero = plano?.valor ?? 0;
      const valorFormatado =
        valorNumero && valorNumero !== 0
          ? `R$${valorNumero.toFixed(2).toString().replace('.', ',')}`
          : 'R$0,00';

      // vencimento "10/MM/AAAA"
      const vencimento = `10/${mes}/${ano}`;

      linhas.push({
        aluno: aluno.nome,
        mesRef: mes,
        anoRef: ano,
        vencimento,
        valor: valorFormatado,
      });
    }

    this.inadimplentesFiltrados = linhas;
    console.log('Relatorio - inadimplentesFiltrados:', this.inadimplentesFiltrados);
  }

  // ==========================
  // Helpers para o HTML
  // ==========================
  get totalInadimplentes() {
    return this.inadimplentesFiltrados.length;
  }

  get mesAnoSelecionadoTexto() {
    return `${this.mesSelecionado}/${this.anoSelecionado}`;
  }
}
