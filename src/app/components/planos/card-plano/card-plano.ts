import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-plano',
  standalone: true,
  templateUrl: './card-plano.html',
  styleUrl: './card-plano.css',
})
export class CardPlano {
  @Input() titulo = '';
  @Input() descricao = '';
  @Input() valor = '';

  @Output() editarPlano = new EventEmitter<void>();
  @Output() excluirPlano = new EventEmitter<void>();

  onClickEditar() {
    this.editarPlano.emit();
  }

  onClickExcluir() {
    this.excluirPlano.emit();
  }
}
