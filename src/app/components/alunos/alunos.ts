import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CardAluno } from './card-aluno/card-aluno';
import { NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../services/auth-service';
import { PlanosService } from '../../services/planos-service';
import { AlunosService } from '../../services/alunos-service';
import { PlanoApi } from '../../models/planos-api';
import { AlunoApi } from '../../models/aluno-api';

type AlunoLista = {
  id: number;
  nome: string;
  contato: string;
  cpf: string;
  endereco: string;
  idPlano: number | null;
  planoNome: string;
};

type PlanoResumo = {
  id: number;
  titulo: string;
};

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [Sidebar, CardAluno, NgFor, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './alunos.html',
  styleUrl: './alunos.css',
})
export class Alunos implements OnInit {
  // lista usada no *ngFor do HTML
  alunos: AlunoLista[] = [];

  // lista para preencher o <select> de planos
  planosDisponiveis: PlanoResumo[] = [];

  // controle do modal de matrícula/edição
  modalMatriculaAberto = false;
  isEditMode = false;
  alunoEditandoId: number | null = null;

  // controle do modal de confirmação de exclusão
  modalExcluirAberto = false;
  alunoParaExcluir: AlunoLista | null = null;

  // objeto usado no [(ngModel)] do formulário
  novoAluno = {
    nome: '',
    telefone: '',
    cpf: '',
    endereco: '',
    idPlano: null as number | null,
  };

  constructor(
    private authService: AuthService,
    private alunosService: AlunosService,
    private planosService: PlanosService,
    private cdr: ChangeDetectorRef
  ) {}

  // =============================
  // ciclo de vida
  // =============================
  ngOnInit(): void {
    this.carregarPlanos();
    this.carregarAlunos();
  }

  // =============================
  // carrega planos da academia logada (para select + nome do plano no card)
  // =============================
  private carregarPlanos(): void {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado (localStorage vazio).');
      this.planosDisponiveis = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    this.planosService.obterPlanos().subscribe({
      next: (data: PlanoApi[]) => {
        const filtrados = (data || []).filter(
          (plano) => Number(plano.idAcademia) === idAcademia
        );

        this.planosDisponiveis = filtrados.map((plano) => ({
          id: plano.id ?? 0,
          titulo: plano.titulo ?? '',
        }));

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar planos:', err);
        this.planosDisponiveis = [];
      },
    });
  }

  private obterNomePlanoPorId(idPlano: number | null): string {
    if (!idPlano) return 'Sem plano';
    const plano = this.planosDisponiveis.find((p) => p.id === idPlano);
    return plano ? plano.titulo : 'Sem plano';
  }

  // =============================
  // carrega alunos do usuário logado
  // =============================
  private carregarAlunos(): void {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.warn('Nenhum usuário logado encontrado (localStorage vazio).');
      this.alunos = [];
      return;
    }

    const idAcademia = Number(usuarioLogado.id);
    console.log('Usuário logado (alunos):', usuarioLogado);

    this.alunosService.obterAlunos().subscribe({
      next: (data: AlunoApi[]) => {
        console.log('Alunos retornados da API (brutos):', data);

        const filtrados = (data || []).filter(
          (aluno) => Number(aluno.idAcademia) === idAcademia
        );

        console.log('Alunos filtrados por idAcademia =', idAcademia, filtrados);

        this.alunos = filtrados.map((aluno) => ({
          id: aluno.id ?? 0,
          nome: aluno.nome ?? '',
          contato: aluno.telefone ?? '',
          cpf: aluno.cpf ?? '',
          endereco: aluno.endereco ?? '',
          idPlano: aluno.idPlano ?? null,
          planoNome: this.obterNomePlanoPorId(aluno.idPlano ?? null),
        }));

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar alunos:', err);
        this.alunos = [];
      },
    });
  }

  // =============================
  // ações do modal de matrícula / edição
  // =============================
  abrirModalMatricula() {
    this.isEditMode = false;
    this.alunoEditandoId = null;
    this.modalMatriculaAberto = true;
    this.novoAluno = {
      nome: '',
      telefone: '',
      cpf: '',
      endereco: '',
      idPlano: null,
    };
  }

  abrirModalEditar(aluno: AlunoLista) {
    this.isEditMode = true;
    this.alunoEditandoId = aluno.id;
    this.modalMatriculaAberto = true;

    this.novoAluno = {
      nome: aluno.nome,
      telefone: aluno.contato,
      cpf: aluno.cpf,
      endereco: aluno.endereco,
      idPlano: aluno.idPlano,
    };
  }

  fecharModalMatricula() {
    this.modalMatriculaAberto = false;
    this.isEditMode = false;
    this.alunoEditandoId = null;
    this.novoAluno = {
      nome: '',
      telefone: '',
      cpf: '',
      endereco: '',
      idPlano: null,
    };
  }

  salvarMatricula() {
    const usuarioLogado = this.authService.getCurrentUser();

    if (!usuarioLogado) {
      console.error('Tentativa de salvar aluno sem usuário logado.');
      return;
    }

    const idAcademia = Number(usuarioLogado.id);

    const payload: AlunoApi = {
      id: this.isEditMode ? this.alunoEditandoId ?? undefined : undefined,
      nome: this.novoAluno.nome,
      telefone: this.novoAluno.telefone,
      cpf: this.novoAluno.cpf,
      endereco: this.novoAluno.endereco,
      idPlano: this.novoAluno.idPlano,
      idAcademia: idAcademia,
    };

    console.log(
      this.isEditMode ? 'Atualizando aluno com payload:' : 'Criando aluno com payload:',
      payload
    );

    const requisicao$ = this.isEditMode
      ? this.alunosService.atualizarAluno(payload)
      : this.alunosService.criarAluno(payload);

    requisicao$.subscribe({
      next: () => {
        this.carregarAlunos();
        this.fecharModalMatricula();
      },
      error: (err) => {
        console.error('Erro ao salvar aluno:', err);
        this.fecharModalMatricula();
      },
    });
  }

  // =============================
  // exclusão com modal
  // =============================
  solicitarExclusao(aluno: AlunoLista) {
    this.alunoParaExcluir = aluno;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluir() {
    this.modalExcluirAberto = false;
    this.alunoParaExcluir = null;
  }

  confirmarExclusao() {
    if (!this.alunoParaExcluir?.id) {
      console.error('Nenhum aluno selecionado para exclusão.');
      return;
    }

    const id = this.alunoParaExcluir.id;

    this.alunosService.deletarAluno(id).subscribe({
      next: () => {
        this.carregarAlunos();
        this.fecharModalExcluir();
      },
      error: (err) => {
        console.error('Erro ao excluir aluno:', err);
        this.fecharModalExcluir();
      },
    });
  }
}
