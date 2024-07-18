export class UserDto {
    uuid: string;
    email: string;
    
    constructor(uuid: string, email: string) {
      this.uuid = uuid;
      this.email = email;
    }
}  