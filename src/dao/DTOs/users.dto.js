class UsersDTO {
    constructor({ first_name, last_name, email, age, password, owner, documents, last_connection,cart }) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
      this.age = age;
      this.password = password
      this.owner = owner
      this.documents = documents;
      this.last_connection = last_connection;
      this.cart = cart
       
    }
  }
  
  module.exports = UsersDTO;