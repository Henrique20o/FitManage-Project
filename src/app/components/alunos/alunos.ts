import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { CardAluno } from "./card-aluno/card-aluno";
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-alunos',
  imports: [Sidebar, CardAluno, NgFor,],
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
}
