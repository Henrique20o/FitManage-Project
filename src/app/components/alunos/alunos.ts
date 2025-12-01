import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { CardAluno } from "./card-aluno/card-aluno";
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alunos',
  imports: [Sidebar, CardAluno, NgFor, FormsModule,CommonModule],
  templateUrl: './alunos.html',
  styleUrl: './alunos.css',
})
export class Alunos {
  alunos = [
    { nome:'José Marcos', contato:'(31) 99999-9999', cpf:'234.344.356-56'},
    { nome:'Julia Maria', contato:'(31) 99999-9999', cpf:'234.344.356-56'},
    { nome:'João Eduardo', contato:'(31) 99999-9999', cpf:'234.344.356-56'},
    { nome:'Maria Julia', contato:'(31) 99999-9999', cpf:'234.344.356-56'},
    { nome:'Matheus Fernando', contato:'(31) 99999-9999', cpf:'234.344.356-56'},
    { nome:'Isabela Farias', contato:'(31) 99999-9999', cpf:'234.344.356-56'}
  ];

  // controla se o modal está aberto
  modalMatriculaAberto = false;

  // opções de planos para o select
  planosDisponiveis = [
    'Musculação 3x',
    'Musculação 6x',
    'Natação 3x',
    'CrossFit 2x'
  ];

  // dados do novo aluno
  novoAluno = {
    nome: '',
    telefone: '',
    cpf: '',
    endereco: '',
    plano: ''
  };

  abrirModalMatricula() {
    this.modalMatriculaAberto = true;
  }

  fecharModalMatricula() {
    this.modalMatriculaAberto = false;
    this.novoAluno = { nome: '', telefone: '', cpf: '', endereco: '', plano: '' };
  }

  salvarMatricula() {
    // por enquanto só adiciona na lista local
    this.alunos.push({
      nome: this.novoAluno.nome,
      contato: this.novoAluno.telefone,
      cpf: this.novoAluno.cpf
    });

    this.fecharModalMatricula();
  }
}
