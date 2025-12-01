import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { CardPlano } from "./card-plano/card-plano";
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-planos',
  imports: [Sidebar, CardPlano, NgFor, FormsModule,CommonModule],
  templateUrl: './planos.html',
  styleUrl: './planos.css',
})
export class Planos {
  planos = [
    {titulo:'Musculação 6x', descricao:'Musculação 6 vezes por semana.', valor:'R$129,90'},
    {titulo:'Natação 3x', descricao:'Natação 3 vezes por semana!', valor:'R$300,00'},
    {titulo:'CrossFit 2x', descricao:'Crossfit 2 vezes por semana.',valor:'R$109,90'},
    {titulo:'Musculação 3x', descricao:'Musculação 3 vezes por semana.', valor:'R$79,90'}
  ];

  // controla se o modal de "Criar novo plano" está aberto
  modalPlanoAberto = false;

  // objeto que recebe os dados do formulário
  novoPlano = {
    titulo: '',
    descricao: '',
    valor: ''
  };

  abrirModalPlano() {
    this.modalPlanoAberto = true;
  }

  fecharModalPlano() {
    this.modalPlanoAberto = false;
    this.novoPlano = { titulo: '', descricao: '', valor: '' };
  }

  salvarPlano() {
    // adiciona o novo plano na lista (por enquanto só em memória)
    this.planos.push({
      titulo: this.novoPlano.titulo,
      descricao: this.novoPlano.descricao,
      valor: this.novoPlano.valor
    });

    this.fecharModalPlano();
  }
}
