import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-aluno',
  imports: [],
  templateUrl: './card-aluno.html',
  styleUrl: './card-aluno.css',
})
export class CardAluno {
  @Input() nome = '';
  @Input() contato = '';
  @Input() cpf = ''
}
