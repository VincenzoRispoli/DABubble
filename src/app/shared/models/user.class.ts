
import { NotificationObj } from "./notificationObj.class";
import { PrivateChat } from "./privateChat.class";

export class User {
    id?: string;
    name!: string;
    email!: string;
    password!: string;
    avatarPath!: string;
    selected: boolean;
    loginState: 'loggedIn' | 'loggedOut' | 'idle';
    notification: any[];
    privateNotification: any[];
    newPrivateMessage: boolean;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.avatarPath = obj ? obj.avatarPath : '';
        this.selected = false;
        this.loginState = 'loggedOut';
        this.notification = obj ? obj.notification : [];
        this.privateNotification = obj ? obj.privateNotification : [];
        this.newPrivateMessage = obj ? obj.newPrivateMessage : false;
    }
}