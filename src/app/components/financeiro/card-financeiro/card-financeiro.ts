import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-financeiro',
  standalone: true,
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

  @Output() editarPagamento = new EventEmitter<void>();
  @Output() excluirPagamento = new EventEmitter<void>();

  onClickEditar() {
    this.editarPagamento.emit();
  }

  onClickExcluir() {
    this.excluirPagamento.emit();
  }
}
