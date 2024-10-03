import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../services/auth/chat/chat.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  userLoginOn: boolean = false;
  isChatOpen: boolean = false;
  messages: any[] = []; 
  user: any;
  
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  constructor(private fb: FormBuilder, 
    private chatService: ChatService, 
    private auth: Auth, private router: Router, 
    private loginService: LoginService) {

    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
  ngAfterViewChecked() {
    this.scrollToBottom();  
  }
  ngOnInit(): void {
    this.loginService.userInfo$.subscribe(user => {
      this.user = user;
      console.log('Información del usuario logueado:', this.user);
      this.loginService.loginStatus$.subscribe((isLoggedIn: boolean) => {
        console.log("userLoginOn: " + this.userLoginOn);
  
        this.userLoginOn = isLoggedIn;
        console.log("userLoginOn: " + this.userLoginOn);
  
      });
    });
    this.auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.user = user;
        
        this.loadMessages(); 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  sendMessage() {
    if (this.chatForm.valid && this.user) {
      const message = this.chatForm.get('message')?.value;
      const senderName = this.loginService.userInfoSubject.getValue()?.firstName || 'Usuario';
      console.log(senderName);
    this.chatService.sendMessage(this.user.email, message, senderName) 
      .then(() => {
        this.chatForm.reset(); 
        this.loadMessages(); 
      })
      .catch((error) => {
        console.error('Error al enviar el mensaje:', error);
      });
    }
  }
  loadMessages() {
    this.chatService.getMessages().subscribe((messages: any) => {
      this.messages = messages; 
      this.scrollToBottom();
    });
  }
  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll al final:', err);
    }
  }
}