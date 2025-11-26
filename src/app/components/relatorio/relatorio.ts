import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-relatorio',
  imports: [Sidebar, NgFor, FormsModule],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css',
})
export class Relatorio {
  // lista de meses para o select
  meses = [
    { codigo: 1,  nome: '01 - Janeiro' },
    { codigo: 2,  nome: '02 - Fevereiro' },
    { codigo: 3,  nome: '03 - Março' },
    { codigo: 4,  nome: '04 - Abril' },
    { codigo: 5,  nome: '05 - Maio' },
    { codigo: 6,  nome: '06 - Junho' },
    { codigo: 7,  nome: '07 - Julho' },
    { codigo: 8,  nome: '08 - Agosto' },
    { codigo: 9,  nome: '09 - Setembro' },
    { codigo: 10, nome: '10 - Outubro' },
    { codigo: 11, nome: '11 - Novembro' },
    { codigo: 12, nome: '12 - Dezembro' }
  ];

  anos = [2024, 2025];

  // valores selecionados nos selects
  mesSelecionado = 5;
  anoSelecionado = 2025;

  // dados fixos só pra montar a tela (sem interface)
  todosInadimplentes = [
    {aluno:'Maria Julia', mesRef:5, anoRef:2025, vencimento:'10/05/2025', valor:'R$290,00'},
    {aluno:'Julia Maria', mesRef:5, anoRef:2025, vencimento:'05/05/2025', valor:'R$79,90'},
    {aluno:'Isabela Farias', mesRef:5,anoRef:2025, vencimento:'01/05/2025', valor:'R$300,00'
    }
  ];

  // o que aparece na tabela
  inadimplentesFiltrados = [...this.todosInadimplentes];

  // total na linha “Total de alunos inadimplentes”
  get totalInadimplentes() {
    return this.inadimplentesFiltrados.length;
  }

  // botão “Buscar”
  onBuscar() {
    this.inadimplentesFiltrados = this.todosInadimplentes.filter(
      (item) =>
        item.mesRef === this.mesSelecionado &&
        item.anoRef === this.anoSelecionado
    );
  }

  // texto “Mês/Ano selecionado: 05/2025”
  get mesAnoSelecionadoTexto() {
    const mesNumero = this.mesSelecionado.toString().padStart(2, '0');
    return `${mesNumero}/${this.anoSelecionado}`;
  }
}
