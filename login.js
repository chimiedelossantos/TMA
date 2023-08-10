function logged() {
    var users = [{
      email: 'admin@yahoo.com',
      password: 'password'
    }, {
      email: 'user@gmail.com',
      password: '123abc'
    }];
  
    var index = -1;
  
    users.forEach(function(user, i) {
      if (user.email === document.getElementById("email").value &&
          user.password === document.getElementById("password").value) {
        index = i;
        return;
      }
    });
  
    if (index !== -1) {
        window.location.href = "create.html";
    } else {
      alert("Error: Incorrect Password or Email");
    }
  }
  