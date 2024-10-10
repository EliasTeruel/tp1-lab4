import { Component, OnInit } from '@angular/core';
import { SimpsonsService  } from '../../services/poke.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss']
})
export class PreguntadosComponent implements OnInit {
  character: any;
  options: string[] = [];
  correctAnswer: string = '';
  score: number = 0;
  selectedAnswer: string | null = null;
  loading: boolean = true;
  lives: number = 3;
  gameOverMessage: string | null = null;

  constructor(private  simpsonsService: SimpsonsService) {}

  ngOnInit() {
    this.loadNewCharacter();
  }

  loadNewCharacter() {
    this.loading = true;
    this.gameOverMessage = null;
    this.simpsonsService.getRandomCharacter().subscribe(data => {
      const characterData = data[0];
      this.character = characterData;
      this.correctAnswer = characterData.character; 
      this.generateOptions(characterData.character);
      this.selectedAnswer = null;
    }, () => {
      this.loading = false; 
    });
  }

  generateOptions(correctName: string) {
    this.options = [correctName];
    const additionalOptions = ["Homer Simpson", "Bart Simpson", "Lisa Simpson", "Marge Simpson"];
    this.options = [...this.options, ...additionalOptions]
      .slice(0, 4);
    this.options = this.shuffleArray(this.options); 
    this.loading = false;
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5); 
  }

  checkAnswer(selectedOption: string) {
    this.selectedAnswer = selectedOption;

    if (selectedOption === this.correctAnswer) {
      this.score++;
    } else {
      this.lives--; 
    }

    
    if (this.lives <= 0) {
      this.gameOverMessage = `Perdiste! la puntuación fue: ${this.score}`;
      this.selectedAnswer = null;
    } else {
      setTimeout(() => this.loadNewCharacter(), 2000); 
    }
  }

  resetGame() {
    this.score = 0; 
    this.lives = 3;
    this.loadNewCharacter(); 
  }
}