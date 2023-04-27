import './style.css';

//Global variables
let userId = JSON.parse(localStorage.getItem("userId")) || '';
let loggedIn = JSON.parse(localStorage.getItem("loggedIn")) || '';
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let categoryNames = [];

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

  let showOrderButton = document.querySelector('#showOrderButton')
  showOrderButton.addEventListener('click', displayMyOrderButtonPress);

  getAllCategories()

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
      body: JSON.stringify(loginUser),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
          //console.log(data)
          if (data.email) {
            openWebShop(data.name)
            userId = data._id
            cart = JSON.parse(localStorage.getItem("cart")) || [];
            localStorage.setItem("loggedIn", JSON.stringify(data.name))
            localStorage.setItem("userId", JSON.stringify(userId))

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
          //console.log(data)
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
  let ordersDiv = document.querySelector('#ordersDiv');
  ordersDiv.style.display = 'block'
  
}

function displayUserInfo(string) {
  console.log(string)
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
      },
    })
    .then(res => res.json())
    .then(data => {
          //console.log(data)
          if (data == null) {
            displayProdcutsDiv.innerHTML = 'no products to display'
          }
          else {

            let printHTML = ''

            for (let i in data) {
              
              let catNam = categoryNames.indexOf(data[i].category)
              //printa html
              printHTML += `<li> ${data[i].name} ${categoryNames[catNam-1]} ${data[i].price} kr 
              <button class='addProductButton' value=${data[i]._id}>+</button> </li>`
            }
        
            displayProdcutsDiv.innerHTML = printHTML;

            setUpClicks()
          }        
    });
}

function loadLocalStorage() {
  userId = JSON.parse(localStorage.getItem("userId")) || '';
  loggedIn = JSON.parse(localStorage.getItem("loggedIn")) || '';
  if (loggedIn != '') {
    openWebShop(loggedIn);
  }  
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartInfo = document.querySelector('#cartInfo')
  cartInfo.innerHTML = cart.length + ' products'

}

function setUpClicks() {
  const addProductToCart = document.querySelectorAll('.addProductButton')
  for (let i = 0; i < addProductToCart.length; i++) {
    addProductToCart[i].addEventListener('click', handleAddProductClick)
  } 
}

function handleAddProductClick(e) {
  console.log('click' + e.target.value)
  cart.push(e.target.value);
  const cartInfo = document.querySelector('#cartInfo')
  cartInfo.innerHTML = cart.length + ' products'
  localStorage.setItem("cart", JSON.stringify(cart))
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
  console.log(sendOrderToServer)
  
  fetch("http://localhost:3000/api/orders/add", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      }, 
      body: JSON.stringify(sendOrderToServer)
    })
    .then(res => res.json())
    .then(data => {
          //console.log(data)
          if (data.acknowledged) {
            alert('Thank you for your order!')
          }
          else {
            alert('Something went wrong!')
          }
    });
    cart = [];
    const cartInfo = document.querySelector('#cartInfo')
    cartInfo.innerHTML = cart.length + ' products'
}

function displayMyOrderButtonPress() {
  let displayOrders = document.querySelector('#displayOrders');
  displayOrders.style.display = 'block';

  let theUser = {
    user: userId
  }

  fetch("http://localhost:3000/api/orders/user", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      }, 
      body: JSON.stringify(theUser)
    })
    .then(res => res.json())
    .then(data => {
          //console.log(data)
          if (data == null) {
            displayOrders.innerHTML = 'no products to display'
          }
          else {
            let printHTML = ''

            for (let i in data) {
              let basicString = data[i].products.map(x => x)
              printHTML += `<li> OrderNr: ${data[i]._id} Prodcuts: ${JSON.stringify(basicString)} </li>`
            }
        
            displayOrders.innerHTML = printHTML;

          }
    });

}

function getAllCategories() {
  let displayCategoriesDiv = document.querySelector('#displayCategories');
  
  fetch("http://localhost:3000/api/categories", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    .then(data => {
          //console.log(data)
          if (data == null) {
            displayCategoriesDiv.innerHTML = 'no categories yet'
          }
          else {
            let printHTML = ''

            for (let i in data) { 
              printHTML += `<button class='categoryButton' value=${data[i]._id}>${data[i].name}</button>`
              categoryNames.push(data[i].name)
              categoryNames.push(data[i]._id)
            }
        
            displayCategoriesDiv.innerHTML = printHTML;
            console.log(categoryNames)

            setUpCategoriesClick() // för filter funktion

          }        
    });
}

function setUpCategoriesClick() {
  const categoryButtons = document.querySelectorAll('.categoryButton')
  for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].addEventListener('click', clickedCategory)
  }
}

function clickedCategory(e) {
  let categoryClicked = e.target.value

  let displayProdcutsDiv = document.querySelector('#displayProdcuts');
  
  fetch(`http://localhost:3000/api/products/category/${categoryClicked}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    .then(data => {
          //console.log(data)
          if (data == null) {
            displayProdcutsDiv.innerHTML = 'no products to display'
          }
          else {

            let printHTML = ''

            for (let i in data) {
              
              let catNam = categoryNames.indexOf(data[i].category)
              //printa html
              printHTML += `<li> ${data[i].name} ${categoryNames[catNam-1]} ${data[i].price} kr 
              <button class='addProductButton' value=${data[i]._id}>+</button> </li>`
            }
        
            displayProdcutsDiv.innerHTML = printHTML;

            setUpClicks()

          }        

    });

}

init()

loadLocalStorage();



