import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-aluno',
  standalone: true,
  imports: [],
  templateUrl: './card-aluno.html',
  styleUrl: './card-aluno.css',
})
export class CardAluno {
  @Input() nome = '';
  @Input() contato = '';
  @Input() cpf = '';
  @Input() endereco = '';
  @Input() planoNome = '';

  @Output() editarAluno = new EventEmitter<void>();
  @Output() excluirAluno = new EventEmitter<void>();

  onClickEditar() {
    this.editarAluno.emit();
  }

  onClickExcluir() {
    this.excluirAluno.emit();
  }
}
