import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-financeiro',
  imports: [],
  templateUrl: './card-financeiro.html',
  styleUrl: './card-financeiro.css',
})
export class CardFinanceiro {
  @Input() titulo = 'Pagamento de Mensalidade';
  @Input() aluno = '';
  @Input() dataPagamento = '';
  @Input() valor = '';
  @Input() mesReferencia = '';
  @Input() anoReferencia = '';
}
