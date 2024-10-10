import { Component, OnInit } from '@angular/core';
import { ScoreService  } from '../../services/score.service';
import { LoginService } from '../../services/auth/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule]
})
export class AboutComponent implements OnInit {
  userInfo: any;
  userScore: number = 0;
  userRank: number = 0;
  currentDate: Date = new Date();
  game: string = '2048';
  ranking: any[] = []; 
  rankingVisible: boolean = false; 


  constructor(private scoreService: ScoreService, private authService: LoginService) { }

  ngOnInit() {
    this.authService.userInfo$.subscribe((user) => {
      if (user) {
        this.userInfo = user;
        //this.loadUserData();
        this.loadUserScoreAndRank();
      }
      else { console.log("error"); }
    });
  }
  // loadUserData() {
  //   this.authService.getCurrentUser().subscribe((userData) => {
  //     this.userInfo = userData;
  //   });
  // }
  async mostrarRanking() {
    this.ranking = await this.scoreService.getUserScores();
    this.rankingVisible = true; 
    console.log('Ranking visible:', this.rankingVisible); 
}

  loadUserScoreAndRank() {
   
    }
  
}
