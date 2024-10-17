import { Component } from '@angular/core';
import { ScoreService } from '../../services/score.service';
import { LoginService } from '../../services/auth/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-puntajes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './puntajes.component.html',
  styleUrl: './puntajes.component.scss'
})
export class PuntajesComponent {
  userInfo: any;
  ranking: any[] = [];
  userScore: number = 0;
  userRank: number = 0;
  rankingVisible: boolean = false;
  game: string = 'Juego 2048';



  constructor(private scoreService: ScoreService, private authService: LoginService) { }

  ngOnInit() {
    this.authService.userInfo$.subscribe((user) => {
      if (user) {
        this.userInfo = user;
        this.loadUserScoreAndRank();
      }
      else { console.log("error"); }
    });
  }


  async loadUserScoreAndRank() {
    try {
      const email = localStorage.getItem('savedUserMail') || '';
      const scores = await this.scoreService.getScoresByGame(this.game);
      this.ranking = scores.sort((a, b) => (b.score || 0) - (a.score || 0));

      const userScoreData = this.ranking.find(score => score.email === email);
      this.userScore = userScoreData ? userScoreData.score : 0;

      this.userRank = this.ranking.findIndex(score => score.email === email) + 1;

      this.rankingVisible = true;
      console.log('Ranking visible:', this.rankingVisible);
    } catch (error) {
      console.error('Error al cargar el ranking:', error);
    }
  }
}
