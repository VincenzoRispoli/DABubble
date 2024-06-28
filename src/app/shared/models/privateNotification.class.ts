
export class PrivateNotification {
    date: number;
    creatorId: string;
    creatorName: string;
    text: string;

    constructor(obj?: any) {
        this.date = obj ? obj.date : '';
        this.creatorId = obj ? obj.creatorId : '';
        this.creatorName = obj ? obj.creatorName : '';
        this.text = obj ? obj.text : '';
    }
    public toJSON() {
        return {
            date: this.date,
            creatorId: this.creatorId,
            creatorName: this.creatorName,
            text: this.text
        }
    }
}
