import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { CreateMessageAreaComponent } from '../create-message-area/create-message-area.component';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../shared/services/firestore-service/firestore.service';
import { BoardService } from '../board.service';
import { MemberDialogsService } from '../../shared/services/member-dialogs.service/member-dialogs.service';
import { CurrentUser } from '../../shared/interfaces/currentUser.interface';
import { ChatMessage } from '../../shared/interfaces/chatMessage.interface';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { PrivateChat } from '../../shared/models/privateChat.class';
import { PrivateNotification } from '../../shared/models/privateNotification.class';

@Component({
  selector: 'app-create-private-message-area',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent],
  templateUrl: './create-private-message-area.component.html',
  styleUrl: './create-private-message-area.component.scss'
})

export class CreatePrivateMessageAreaComponent extends CreateMessageAreaComponent implements OnInit {
  @Input() allUsers!: CurrentUser[]
  @Output() setToTrue: EventEmitter<boolean> = new EventEmitter<boolean>()

  firestore = inject(FirestoreService);
  boardServ = inject(BoardService);
  memberServ = inject(MemberDialogsService);

  currentChatPartner!: CurrentUser;
  privateChat!: ChatMessage[];
  privChatRoom!: PrivateChat;
  privChatRoomId?: string;
  chatId?: string;
  override message!: ChatMessage;

  privateNotification: PrivateNotification = new PrivateNotification();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.privChatRoom = this.firestore.directMessages[this.boardServ.chatPartnerIdx];
    this.privateChat = this.firestore.directMessages[this.boardServ.chatPartnerIdx].chat;
    console.log(this.boardServ.privateChatId);
    setTimeout(() => {
      this.resetPrivateNotification();
    }, 100)
  }

  async resetPrivateNotification() {
    if (this.boardServ.resetCreatorPrivateNotification && this.boardServ.privateChatId) {
      this.privChatRoom.guest.privatNotification = [];
      await this.firestore.updateGuest(this.boardServ.privateChatId, this.privChatRoom.guest);
      this.boardServ.resetCreatorPrivateNotification = false;
    } else if (this.boardServ.resetGuestPrivateNotification && this.boardServ.privateChatId) {
      this.privChatRoom.creator.privatNotification = [];
      await this.firestore.updateCreator(this.boardServ.privateChatId, this.privChatRoom.creator);
      this.boardServ.resetGuestPrivateNotification = false;
    }
  }
  override toggleTagMemberDialog() {
    this.filteredMembers = this.allUsers;
    this.tagMembers = !this.tagMembers
  }

  override filterMember() {
    let members: CurrentUser[] = this.allUsers;
    let lowerCaseTag = this.memberToTag.slice(1).toLowerCase();
    this.filteredMembers = members.filter(member => member.name.toLowerCase().includes(lowerCaseTag))
  }

  override async sendMessage(event?: Event) {
    if (this.boardServ.privateChatId) {
      let date = new Date().getTime();
      this.message = this.setMessageObject(date);
      this.setAnswerMessage();
      if (this.message.message.trim() !== '' || this.uploadedFile.length > 0) {
        await this.firestore.updatePrivateChat(this.boardServ.privateChatId, this.message)
          .then(() => {
            this.setPrivateNotificationObject();
            if (this.currentUserIsCreator()) {
              this.addNewNotificationAndShowPopUpNotificationForCreator();
            } else if (this.currentUserIsGuest()) {
              this.addNewNotificationAndShowPopUpNotificationForGuest();
            }
            this.resetTextArea();
          });
        setTimeout(() => {
          this.showMessageInChat();
        }, 1)
      }
    }
  }

  currentUserIsCreator() {
    return this.boardServ.currentUser.id === this.privChatRoom.creator.id;
  }

  currentUserIsGuest() {
    return this.boardServ.currentUser.id === this.privChatRoom.guest.id;
  }

  addNewNotificationAndShowPopUpNotificationForCreator() {
    this.privChatRoom.creator.privatNotification.push(this.privateNotification.toJSON());
    if (this.boardServ.privateChatId) {
      this.privChatRoom.creator.newPrivateMessage = true;
      this.firestore.updateCreator(this.boardServ.privateChatId, this.privChatRoom.creator);
      this.hideCreatorNewPrivateMessage(this.boardServ.privateChatId, this.privChatRoom.creator);
    }
  }

  addNewNotificationAndShowPopUpNotificationForGuest() {
    this.privChatRoom.guest.privatNotification.push(this.privateNotification.toJSON());
    if (this.boardServ.privateChatId) {
      this.privChatRoom.guest.newPrivateMessage = true;
      this.firestore.updateGuest(this.boardServ.privateChatId, this.privChatRoom.guest);
      this.hideGuestNewPrivateMessage(this.boardServ.privateChatId, this.privChatRoom.guest);
    }
  }

  setPrivateNotificationObject() {
    this.privateNotification.creatorId = this.boardServ.currentUser.id
    this.privateNotification.creatorName = this.boardServ.currentUser.name
    this.privateNotification.date = new Date().getTime()
    this.privateNotification.text = this.message.message
  }

  hideCreatorNewPrivateMessage(chatId: string, creator: CurrentUser) {
    setTimeout(() => {
      this.privChatRoom.creator.newPrivateMessage = false;
      this.firestore.updateCreator(chatId, creator);
    }, 2000)
  }

  hideGuestNewPrivateMessage(chatId: string, guest: CurrentUser) {
    setTimeout(() => {
      this.privChatRoom.guest.newPrivateMessage = false;
      this.firestore.updateGuest(chatId, guest);
    }, 2000)
  }

  setAnswerMessage() {
    if (this.boardServ.privateAnswerMessage != null) {
      this.message.answers.push(this.boardServ.privateAnswerMessage);
    }
  }

  showMessageInChat() {
    let idx;
    idx = this.firestoreService.directMessages.findIndex((dm: PrivateChat) => dm.guest.id == this.boardServ.currentChatPartner.id);
    if (idx !== -1) {
      this.boardServ.startPrivateChat(idx, 'creator', event);
    } else {
      idx = this.firestoreService.directMessages.findIndex((dm: PrivateChat) => dm.creator.id == this.boardServ.currentChatPartner.id)
      if (idx !== -1) {
        this.boardServ.startPrivateChat(idx, 'guest', event);
      }
    }
  }

  override resetTextArea() {
    this.uploadedFile = '';
    this.textMessage = '';
    this.filePath = '';
    this.boardServ.scrollToBottom(this.boardServ.chatFieldRef);
    this.checkIfPrivatChatIsEmpty();
    this.boardServ.privateAnswerMessage = null;
  }

  checkIfPrivatChatIsEmpty() {
    if (this.privateChat.length > 0) {
      this.boardServ.firstPrivateMessageWasSent = true;
      setTimeout(() => {
        this.boardServ.hidePopUpChatPartner = true;
      }, 100);
    } else {
      this.boardServ.hidePopUpChatPartner = false
      setTimeout(() => {
        this.boardServ.firstPrivateMessageWasSent = false;
      }, 100);
    }
  }

  override setMessageObject(date: number): ChatMessage {
    return {
      date: date,
      user: this.boardService.currentUser,
      message: this.textMessage.replace('/\n/g', '<br>'),
      answers: [],
      reactions: [],
      fileUpload: this.uploadedFile,
      type: 'ChatMessage',
    }
  }
}
