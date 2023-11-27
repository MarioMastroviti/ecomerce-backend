class UsersDTO {
    constructor({ first_name, last_name, email, age, password, owner }) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
      this.age = age;
      this.password = password
      this.owner = owner
 
    }
  }
  
  module.exports = UsersDTO;