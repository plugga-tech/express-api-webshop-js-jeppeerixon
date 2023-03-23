import './style.css';

function init() {
  let loginUserBtn = document.querySelector("#loginButton");
  loginUserBtn.addEventListener('click', handleLoginButtonPress);

  let registerUserBtn = document.querySelector("#registerButton");  
  registerUserBtn.addEventListener('click', handleRegisterButtonPress);

  const cart = [{
    
  }
  ]

  displayAllProducts()

}

function handleLoginButtonPress() {
  let loginEmail = document.querySelector('input[name="loginemail"]');
  let loginPassword = document.querySelector('input[name="loginpsw"]');

  let loginUser = {
    email: loginEmail.value,
    password: loginPassword.value
  }

  fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      }, 
      body: JSON.stringify(loginUser)
    })
    .then(res => res.json())
    .then(data => {
          console.log(data)
          if (data.email) {
            displayUserInfo(data.email)
          }
          else {
              console.log("Inloggning misslyckades, var vänlig och kontrollera användarnamn och lösenord.")
          }
    
    });
}

function handleRegisterButtonPress() {
  let registerName = document.querySelector('input[name="registername"]');
  let registerEmail = document.querySelector('input[name="registeremail"]');
  let registerPassword = document.querySelector('input[name="registerpsw"]');

  let registerUser = {
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value
  }
  console.log(registerUser);

  fetch("http://localhost:3000/api/users/add", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      }, 
      body: JSON.stringify(registerUser)
    })
    .then(res => res.json())
    .then(data => {
          console.log(data)
          if (data.acknowledged) {
            displayUserInfo('created new user')
          }
          else {
              console.log("Register failed, var vänlig och kontrollera inputfälten.")
          }

    });
}

function displayUserInfo(string) {
  let userInfoDiv = document.querySelector('#userInfo');
  userInfoDiv.innerHTML = string;

}

function displayAllProducts() {
  let displayProdcutsDiv = document.querySelector('#displayProdcuts');
  
  fetch("http://localhost:3000/api/products", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      }
    })
    .then(res => res.json())
    .then(data => {
          console.log(data)
          if (data == null) {
            displayProdcutsDiv.innerHTML = 'no products to display'
          }
          else {
            let printHTML = ''

            for (let i in data) { 
              printHTML += `<li> ${data[i].name} ${data[i].description} ${data[i].price} kr 
              <button class='addProductButton' value=${data[i]._id}>+</button> </li>`
            }
        
            displayProdcutsDiv.innerHTML = printHTML;

            setUpClicks()

          }        

    });

    

}

function setUpClicks() {
  const addProductToCart = document.querySelectorAll('.addProductButton')
  for (let i = 0; i < addProductToCart.length; i++) {
    addProductToCart[i].addEventListener('click', handleAddProductClick)
  } 
}

function handleAddProductClick(e) {
  console.log(e.target.value)
}
  



init()



