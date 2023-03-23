import './style.css';

//Global variables
let userId = '';
let cart = []

function init() {
  let loginUserBtn = document.querySelector("#loginButton");
  loginUserBtn.addEventListener('click', handleLoginButtonPress);

  let registerUserBtn = document.querySelector("#registerButton");  
  registerUserBtn.addEventListener('click', handleRegisterButtonPress);

  let cartBtn = document.querySelector("#cartButton");
  cartBtn.addEventListener('click', handleCartOrderButtonPress);

  let signUpLink = document.querySelector('#signUpLink');
  let registerForm = document.querySelector('#registerForm');
  signUpLink.addEventListener('click', () => {
    registerForm.style.display = 'block'    
  })

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
            openWebShop(data.name)
            userId = data._id
            console.log(userId)

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
            alert('created new user - please log in to continue')
          }
          else {
              console.log("Register failed, var vänlig och kontrollera inputfälten.")
          }

    });
}

function openWebShop(userName) {
  displayUserInfo(userName)
  let webshopDiv = document.querySelector('#webshopDiv');
  webshopDiv.style.display = 'block'
  
}

function displayUserInfo(string) {
  let userInfoCart = document.querySelector('#userInfoCart');
  userInfoCart.style.display = 'block'
  let nameInfo = document.querySelector('#nameInfo');
  nameInfo.innerHTML = string;

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
  const cartInfo = document.querySelector('#cartInfo')
  cart.push(e.target.value);
  cartInfo.innerHTML = cart.length + ' products'
}

function calculateCartOrder() {
  const addAllProducts = {};
  cart.forEach(function (x) { addAllProducts[x] = (addAllProducts[x] || 0) + 1; });
  let allProductsOrder = []
  for (const [key, value] of Object.entries(addAllProducts)) {
    let singelProductOrder = {
      "productId": key,
      "quantity": value
    }
    allProductsOrder.push(singelProductOrder);
  }
  let finalOrder = 
  {
    "user": userId, 
        "products": allProductsOrder
  }

  return finalOrder;
}

function handleCartOrderButtonPress() {
  let sendOrderToServer = calculateCartOrder()
  
  fetch("http://localhost:3000/api/orders/add", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      }, 
      body: JSON.stringify(sendOrderToServer)
    })
    .then(res => res.json())
    .then(data => {
          console.log(data)
          if (data.acknowledged) {
            alert('Thank you for your order!')
          }
          else {
            alert('Something went wrong!')
          }
    });
}

init()



