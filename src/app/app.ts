import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal';
import { HelpChatWidgetComponent } from './components/public/help-chat-widget/help-chat-widget';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmationModalComponent, HelpChatWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Café del Valle';
}
