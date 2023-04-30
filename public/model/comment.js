export class Comment{
    constructor(data) {
        if(data){
            this.email = data.email;
            this.message = data.message;
            this.timestamp = data.timestamp;

        }
    }

    set_docId(id){
        this.set_docId = id;
    }

    toFirestore() {
        return {
            email: this.email,
            message: this.message,
            timestamp: this.timestamp,
        }
    }

    toFirestoreForUpdate() {
        const p = {};
        if (this.email) p.email = this.email;
        if (this.message) p.message = this.message;
        if (this.timestamp) p.timestamp = this.timestamp;
        return p;
    }
}