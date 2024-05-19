const main = document.querySelector("main");

// IIFE
(async function () {
  const hasToken = checkToken();
  if (!hasToken) redirectToLogin();

  const products = await fetchProducts(); // array

  if (products.length) {
    renderProducts(products);
  }
})();

function checkToken() {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

function redirectToLogin() {
  window.location.href = "http://127.0.0.1:9000/login.html";
}

async function fetchProducts() {
  showSpinner();

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    return products;
  } catch (error) {
    console.error(error);
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  const div = document.createElement("div");
  div.className = "spinner";
  document.body.prepend(div);
}

function hideSpinner() {
  const spinner = document.querySelector(".spinner");
  spinner.remove();
}

function renderProducts(products) {
  const container = document.createElement("ul");
  container.className = "container";
  const select = document.createElement("select")
  select.className = "select";

  const renderOption = async () => {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const data = await res.json();
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      select.append(option);
    });
  }
  renderOption()

  const optionAll = document.createElement("option");
  optionAll.value = "All";
  optionAll.textContent = "All";
  select.prepend(optionAll);


  main.prepend(select);



  select.addEventListener("change", async (e) => {
    const value = e.target.value;
    if (value === "All") {
      renderProducts(fetchProducts());
    } else {
      fetchCategories(value)
      const categories = await fetchCategories(value);
      // console.log(categories);
      renderProducts(categories);
    }
  })



  products.forEach(function (product) {
    // object
    const li = document.createElement("li");
    li.id = `productId-${product.id}`;

    const a = document.createElement("a");
    a.href = `http://127.0.0.1:9000/product.html?id=${product.id}`;

    const img = document.createElement("img");
    img.src = product.image;
    li.append(img);

    const title = document.createElement("p");
    title.textContent = product.title;
    a.append(title);
    li.append(a);

    const price = document.createElement("strong");
    price.textContent = product.price;
    li.append(price);

    const starsContainer = document.createElement("div");
    const stars = "<span>⭐️</span>".repeat(Math.round(product.rating.rate));
    starsContainer.insertAdjacentHTML("beforeend", stars);
    li.append(starsContainer);

    const ratingCount = document.createElement("div");
    ratingCount.textContent = `(${product.rating.count})`;
    li.append(ratingCount);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
      editProduct(product.id);
    };
    li.append(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      deleteBtn.textContent = "";
      const div = document.createElement("div");
      div.className = "spinner";
      deleteBtn.prepend(div);
      div.style.margin = "0 auto";
      deleteProduct(product.id);
    };
    li.append(deleteBtn);

    container.append(li);
    main.append(container);
  });
}

const modal = document.querySelector(".modal");
const close_btn = document.querySelector(".modal__close");
const submitBtn = document.querySelector(".modal__btn")
async function editProduct(id) {
  modal.style.display = "flex";

  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  const data = await response.json();

  const title = document.querySelector(".edit_title");
  const price = document.querySelector(".edit_price");

  title.onclick = function () {
    let newTitle = prompt("Enter new title", data.title);
    if (newTitle !== null) {
      fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: newTitle,
        }),
      }).then((res) => res.json()).then(() => {
        renderProducts()
      })
    }

    price.onclick = function () {
      let newPrice = prompt("Enter new price", data.price);
      if (newPrice !== null) {
        fetch(`https://fakestoreapi.com/products/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            price: newPrice,
          }),
        }).then((res) => res.json()).then(() => {
          renderProducts()
        })
      }
    }
  }

  async function deleteProduct(id) {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });


    const data = await response.json();
    const product = document.getElementById(`productId-${id}`);
    product.remove();
    hideSpinner();
  }

  // async function editProduct(id) {
  //   const response = await fetch(`https://fakestoreapi.com/products/${id}`,{
  //     method: "",
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }

  close_btn.onclick = function () {
    modal.style.display = "none";
  }

  submitBtn.onclick = function () {
    modal.style.display = "none";
    location.reload();
  }
}
