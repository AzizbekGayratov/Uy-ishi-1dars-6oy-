const usernameInput = document.getElementsByName("username")[0];
const passwordInput = document.getElementsByName("password")[0];
const form = document.querySelector("form");
const loginButton = document.querySelector("button[type='submit']");
const resetButton = document.querySelector("button[type='reset']");
const visibilityBtn = document.querySelector("button.visibility-btn");
const eyeContainer = document.querySelector("button.visibility-btn > span");

let username, password
let passwordShow = false;

(function () {
  const hasToken = checkToken();

  console.log(visibilityBtn, eyeContainer);
  eyeContainer.textContent = "visibility_off";

  visibilityBtn.onclick = function () {
    passwordShow = passwordShow ? false : true;

    if (passwordShow == true) {
      passwordInput.type = "text";
      eyeContainer.textContent = 'visibility';
    } else {
      passwordInput.type = "password";
      eyeContainer.textContent = 'visibility_off';
    }
  };

  if (hasToken) {
    redirect();
  }

  resetButton.onclick = resetInputValues;

  username = usernameInput.value;
  password = passwordInput.value;

  toggleButton();

  usernameInput.oninput = function (event) {
    username = event.target.value.trim();
    toggleButton();
  };

  passwordInput.oninput = function (event) {
    password = event.target.value.trim();
    toggleButton();
  };

  form.onsubmit = async function (event) {
    event.preventDefault();

    const result = await login();
    saveToken(result.token);
    redirect();
  };
})();

function checkToken() {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

function redirect() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "http://127.0.0.1:9000/index.html";
  }
}

function toggleButton() {
  if (username && password) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

async function login() {
  const response = await fetch("https://fakestoreapi.com/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  return result;
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

function resetInputValues() {
  username = "";
  password = "";
}
