import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore-service/firestore.service';
import { BoardService } from '../board.service';
import { MemberDialogsService } from '../../shared/services/member-dialogs.service/member-dialogs.service';

@Component({
  selector: 'app-pop-up-private-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up-private-notification.component.html',
  styleUrl: './pop-up-private-notification.component.scss'
})
export class PopUpPrivateNotificationComponent {

  firestore = inject(FirestoreService);
  boardServ = inject(BoardService);
  memberServ = inject(MemberDialogsService);

  
}
