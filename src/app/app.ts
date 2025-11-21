import { Component } from '@angular/core';
import { SupportChatbotComponent } from '../../projects/support-chatbot/src/lib/support-chatbot.component';

@Component({
  selector: 'app-root',
  imports: [SupportChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'support-chat-app';
}
