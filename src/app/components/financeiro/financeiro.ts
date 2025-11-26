import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { CardFinanceiro } from "./card-financeiro/card-financeiro";
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-financeiro',
  imports: [Sidebar, CardFinanceiro,NgFor,],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.css',
})
export class Financeiro {
  pagamentos = [
    {aluno:'Matheus Fernando', dataPagamento:'10/01/2025', valor:'R$429,90', mesReferencia:'06', anoReferencia:'2025'},
    {aluno:'Matheus Fernando', dataPagamento:'10/01/2025', valor:'R$429,90', mesReferencia:'06', anoReferencia:'2025'},
    {aluno:'Matheus Fernando', dataPagamento:'10/01/2025', valor:'R$429,90', mesReferencia:'06', anoReferencia:'2025'},
    {aluno:'Matheus Fernando', dataPagamento:'10/01/2025', valor:'R$429,90', mesReferencia:'06', anoReferencia:'2025'}
  ];
}
