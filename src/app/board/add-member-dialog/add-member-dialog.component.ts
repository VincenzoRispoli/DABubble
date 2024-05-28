import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../board.service';
import { AddSpecificPersonDialogComponent } from './add-specific-person-dialog/add-specific-person-dialog.component';
import { MemberDialogsService } from '../../shared/services/member-dialogs.service/member-dialogs.service';
import { FirestoreService } from '../../shared/services/firestore-service/firestore.service';
import { Channel } from '../../shared/models/channel.class';
import { CurrentUser } from '../../shared/interfaces/currentUser.interface';
@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, AddSpecificPersonDialogComponent],
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.scss'
})
export class AddMemberDialogComponent {
  specificMember: boolean = false;
  allMembers: boolean = false;
  memberServ = inject(MemberDialogsService);
  boardServ = inject(BoardService);
  firestore = inject(FirestoreService);
  currentChannel!: Channel;
  currentChannelId!: string;
  allUsers!: CurrentUser[];

  constructor() {
    this.currentChannel = this.firestore.allChannels[this.boardServ.idx];
    this.currentChannelId = this.firestore.allChannels[this.boardServ.idx].id;
    console.log(this.currentChannelId);
  }

  onCheck(condition: string) {
    if (condition == "allMembers") {
      this.allMembers = !this.allMembers;
      this.specificMember = false;
    } else {
      this.specificMember = !this.specificMember;
      this.allMembers = false;
    }
  }

  async setAllUsersOnSelectedTrue() {
    this.currentChannel.allUsers.forEach((user) => {
      user.selected = true;
    });
    this.allUsers = this.currentChannel.allUsers;
    await this.firestore.updateChannelUsers(this.allUsers, this.currentChannelId);
    this.addUserToMemberArray();
  }

  addUserToMemberArray() {
    this.allUsers.forEach(user => {
      this.currentChannel.members.push(user);
    });
    this.currentChannel.members.forEach(members => {
      this.firestore.updateMembers(members, this.currentChannelId);
    })
  }


  closeAddMemberDialog(event: Event) {
    this.memberServ.addMemberDialogIsOpen = false;
    this.memberServ.addSpecificPerson = false;
    event.stopPropagation();
  }
}
