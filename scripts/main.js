const main = document.querySelector(".box");
const box = document.querySelector("main");
const modal = document.querySelector(".modal");
const close_btn = document.querySelector(".modal__close");


const hasToken = checkToken();
if (!hasToken) redirectToLogin();

const select = () => {
    const select = document.createElement("select");
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
    const defaultOption = document.createElement("option");
    defaultOption.value = "default";
    defaultOption.textContent = "Category filter";
    select.prepend(defaultOption);
    const optionAll = document.createElement("option");
    optionAll.value = "All";
    optionAll.textContent = "All";
    select.append(optionAll);

    box.prepend(select)

    select.addEventListener("change", (e) => {
        showSpinner();
        const value = e.target.value;
        localStorage.setItem("arr", JSON.stringify(value));
        renderSelect();
    })
}
select()

const renderProducts = (products) => {
    const cardBox = document.createElement("ul");
    cardBox.className = "container";
    main.append(cardBox);


    products.forEach((product) => {
        cardBox.innerHTML += `
        <li data-click="${product.id}" id="productId-${product.id}">
            <img src="${product.image}" alt="img">
            <a href="http://127.0.0.1:9000/product.html?id=${product.id}">
                <p class="title">${product.title}</p>
            </a>
            <strong class="price">${product.price}</strong>
            <div>
                ${productRate(product.rating.rate)}
            </div>
            <div>
                <p>(${product.rating.count})</p>
            </div>
            <button class="edit" data-edit="${product.id}">Edit</button>
            <button class="delete" data-delete="${product.id}">Delete</button>
        </li>
        `
    })
}
const getData = async () => {
    showSpinner()
    try {
        await fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                if (data.length) {
                    renderProducts(data)
                }
            })
    } catch (error) {
        console.log(error)
    } finally {
        hideSpinner()
    }
}
getData()

const renderSelect = () => {
    let arr = JSON.parse(localStorage.getItem("arr"));

    if (arr === "All") {
        fetch("https://fakestoreapi.com/products").then((res) => res.json()).then((data) => {
            main.innerHTML = "";
            renderProducts(data)
            hideSpinner()
        })
    } else {
        fetch(`https://fakestoreapi.com/products/category/${arr}`)
            .then(res => res.json())
            .then(data => {
                main.innerHTML = "";
                renderProducts(data)
                hideSpinner()
            })
    }
}

function checkToken() {
    const token = localStorage.getItem("token");
    return Boolean(token);
}

function redirectToLogin() {
    window.location.href = "http://127.0.0.1:9000/login.html";
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
const productRate = (rate) => {
    let stars = "<span>⭐️</span>".repeat(Math.round(rate));
    return stars;
}


main.addEventListener("click", (event) => {
    if (event.target.dataset.edit) {
        editProduct(event.target.dataset.edit);
    } else if (event.target.dataset.delete) {
        deleteProduct(event.target.dataset.delete);
    }
})

const deleteProduct = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
    }).then((res) => res.json()).then(() => { })

    const deleteBtn = document.querySelector(`.delete[data-delete="${id}"]`);
    const div = document.createElement("div");
    deleteBtn.textContent = "";
    div.style.margin = "0 auto";
    div.className = "spinner";
    deleteBtn.prepend(div);

    setTimeout(() => {
        const product = document.getElementById(`productId-${id}`);
        product.remove();
        hideSpinner();
    }, 500)
}

const editProduct = (id) => {
    modal.style.display = "flex";
    fetchEditedProduct(id);

    const form = document.querySelector(".form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.querySelector(".form_title");
        const price = document.querySelector(".form_price");

        fetch(`https://fakestoreapi.com/products/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.value,
                price: price.value,
            }),
        }).then((res) => {
            return res.json()
        }).then((json) => {
            // console.log(json.id);
            fetchData(json.id)
            modal.style.display = "none";
            renderProducts();
        })
    })
}

const fetchData = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(data => {
            const product = document.getElementById(`productId-${id}`);
            const title = product.querySelector(".title");
            const price = product.querySelector(".price");
            console.log(title, price);

            const intitle = document.querySelector(".form_title");
            const inprice = document.querySelector(".form_price");

            title.textContent = intitle.value;
            price.textContent = inprice.value;

            console.log(data);
        })
}

const fetchEditedProduct = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(data => {
            const title = document.querySelector(".form_title");
            const price = document.querySelector(".form_price");
            title.value = data.title;
            price.value = data.price;
        })
}


close_btn.onclick = () => {
    modal.style.display = "none";
}