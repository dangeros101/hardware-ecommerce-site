// DOM Elements
const searchBtn = document.querySelector('.fa-search');
const searchBar = document.getElementById('search-bar');
const itemsContainer = document.querySelector('.items-container');
const cartBtn = document.querySelector('.fa-cart-plus');
const cart = document.querySelector('.inside-cart');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.fa-window-close');
const cartQuantity = document.querySelector('.quantity');
const total = document.querySelector('.total-price span');
const cartContent = document.querySelector('.cart-content');


// Show total price
let totalPrice = 0;
total.textContent = totalPrice;

// Show number of items in cart
let cartQ = 0;
cartQuantity.textContent = cartQ;

// Show/Hide Cart
cartBtn.addEventListener('click', () => {
    cart.style.transform = 'translateX(0)';
    overlay.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cart.style.transform = 'translateX(500px)';
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    cart.style.transform = 'translateX(500px)';
    overlay.style.display = 'none';
});


class UI {
    static showProducts(data) {
        let output = '';
        for (let i = 0; i < data.length; i++) {
            output += `<div class="item-card" data-id="${data[i].id}">
            <div class="item-image">
                <img src="${data[i].image}">
                <button type="button" class="add-item"><i class="fas fa-cart-arrow-down"></i> ADD TO CART</button>
            </div>
            <h3 class="item-name">${data[i].name}</h3>
            <p class="item-price">$${data[i].price}</p>
            </div>`;

            itemsContainer.innerHTML = output;
        }
    }

    static addProducts(data) {
        const addBtn = document.querySelectorAll('.add-item');

        // Save item in local storage
        if (localStorage.getItem('products') === null) {
            let products = [];
            localStorage.setItem('products', JSON.stringify(products));
        } else {
            let products = JSON.parse(localStorage.getItem('products'));
            localStorage.setItem('products', JSON.stringify(products));
        }

        let products = JSON.parse(localStorage.getItem('products'));
        for (let i = 0; i < data.length; i++) {
            for (let l = 0; l < products.length; l++) {
                if (products[l].name === data[i].name) {
                    addBtn[i].textContent = 'ITEM ADDED TO CART';
                }
            };

            addBtn[i].addEventListener('click', () => {
                if (addBtn[i].textContent != 'ITEM ADDED TO CART') {
                    let output = '';
                    let itemQ = 1;
                    
                    output += `<div class="cart-item" data-id="${data[i].id}">
                    <img src="${data[i].image}">
                    <div class="cart-item-content">
                        <h4>${data[i].name}</h4>
                        <p>$${data[i].price}</p>
                        <button type="button" class="delete">Delete</button>
                    </div>
                    <div class="cart-item-quantity">
                        <i class="fas fa-chevron-up"></i>
                        <span class="quantity-number">${itemQ}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    </div>`;

                    cartContent.innerHTML += output;

                    addBtn[i].textContent = 'ITEM ADDED TO CART';

                    let quantities = JSON.parse(localStorage.getItem('item-quantity'));
                    quantities.push("1");
                    localStorage.setItem('item-quantity', JSON.stringify(quantities));

                    cartQ ++;
                    cartQuantity.textContent = cartQ;
                    if (localStorage.getItem('cart-quantity') === null) {
                        localStorage.setItem('cart-quantity', cartQ);
                    } else {
                        let cartQuantities = localStorage.getItem('cart-quantity');
                        cartQuantities ++;
                        cartQuantity.textContent = cartQuantities;
                        localStorage.setItem('cart-quantity', cartQuantities);
                    }

                    totalPrice += data[i].price;
                    total.textContent = totalPrice.toFixed(2); 
                    if (localStorage.getItem('total-cost') === null) {
                        localStorage.setItem('total-cost', totalPrice.toFixed(2))
                    } else {
                        let totalCost = parseFloat(localStorage.getItem('total-cost'));
                        totalCost += data[i].price;
                        total.textContent = parseFloat(totalCost).toFixed(2);
                        localStorage.setItem('total-cost', parseFloat(totalCost).toFixed(2));
                    }

                    increaseDecrease();
                    deleteItems(data);

                } else {
                    return;
                }

                if (data[i].id === parseInt(cartContent.children[cartContent.children.length - 1].getAttribute('data-id'))) {
                    let product = {
                        name: data[i].name,
                        price: data[i].price,
                        image: data[i].image
                    }
    
                    let products = JSON.parse(localStorage.getItem('products'));
                    products.push(product);
                    localStorage.setItem('products', JSON.stringify(products));
                }
            });
        }
    }
}

// Fetch the items
fetch('products.json').then(response => {
    response.json().then(data => {
        UI.showProducts(data);
        UI.addProducts(data);

        // Show saved products in cart
        let products = JSON.parse(localStorage.getItem('products'));

        if (localStorage.getItem('item-quantity') === null) {
            let quantities = [];
            localStorage.setItem('item-quantity', JSON.stringify(quantities));
        } 

        for (let l = 0; l < products.length; l++) {
            let output = '';

            let quantities = JSON.parse(localStorage.getItem('item-quantity'));
            let cartQuantities = localStorage.getItem('cart-quantity');
            let totalCost = localStorage.getItem('total-cost');            

            output += `<div class="cart-item">
            <img src="${products[l].image}">
            <div class="cart-item-content">
                <h4>${products[l].name}</h4>
                <p>$${products[l].price}</p>
                <button type="button" class="delete">Delete</button>
            </div>
            <div class="cart-item-quantity">
                <i class="fas fa-chevron-up"></i>
                <span class="quantity-number">${quantities[l]}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            </div>`;

            cartContent.innerHTML += output;

            cartQ ++;
            cartQuantity.textContent = cartQuantities;

            totalPrice += products[l].price;
            total.textContent = totalCost;
        }

        localStorage.setItem('products', JSON.stringify(products));

        increaseDecrease();
        deleteItems(data);


        // Clear cart

        const clearBtn = document.querySelector('.clear-cart');

        clearBtn.addEventListener('click', () => {
            let products = JSON.parse(localStorage.getItem('products'));
            products = [];
            localStorage.setItem('products', JSON.stringify(products));

            cartContent.innerHTML = ``;

            let quantities = JSON.parse(localStorage.getItem('item-quantity'));
            quantities = [];
            localStorage.setItem('item-quantity', JSON.stringify(quantities));

            let cartQuantities = localStorage.getItem('cart-quantity');
            cartQuantities = 0;
            cartQuantity.textContent = cartQuantities;
            localStorage.setItem('cart-quantity', cartQuantities);

            let totalCost = localStorage.getItem('total-cost');
            totalCost = 0;
            total.textContent = totalCost;
            localStorage.setItem('total-cost', totalCost);    

            const addBtn = document.querySelectorAll('.add-item');

            for (let j = 0; j < data.length; j++) {
                addBtn[j].innerHTML = `<i class="fas fa-cart-arrow-down"></i> ADD TO CART`;
            }
        });
    });
});



// Increase/Decrease number of items
function increaseDecrease() {
    const increase = document.querySelectorAll('.fa-chevron-up');
    const decrease = document.querySelectorAll('.fa-chevron-down');
    const itemQuantity = document.querySelectorAll('.quantity-number');


    for (let j = 0; j < increase.length; j++) {
        increase[j].addEventListener('click', () => {
            itemQuantity[j].innerHTML ++;

            // Show each item's quantity
            let quantities = JSON.parse(localStorage.getItem('item-quantity'));
            if (quantities.indexOf(quantities[j]) === j) {
                quantities[j] = itemQuantity[j].innerHTML
            } else if (quantities.some(value => value === quantities[j])) {
                quantities[j] = itemQuantity[j].innerHTML
            } else {
                quantities.push(itemQuantity[j].innerHTML)
            }

            localStorage.setItem('item-quantity', JSON.stringify(quantities));

            let cartQuantities = localStorage.getItem('cart-quantity');
            cartQuantities ++;
            cartQuantity.textContent = cartQuantities;
            localStorage.setItem('cart-quantity', cartQuantities);

            let totalCost = parseFloat(localStorage.getItem('total-cost'));
            let itemPrice = parseFloat(itemQuantity[j].parentElement.previousElementSibling.children[1].textContent.slice(1));
            totalCost += itemPrice;
            total.textContent = parseFloat(totalCost).toFixed(2);
            localStorage.setItem('total-cost', parseFloat(totalCost).toFixed(2));
        });

        decrease[j].addEventListener('click', () => {
            if (itemQuantity[j].innerHTML > 1) {
                itemQuantity[j].innerHTML --;

                // Show each item's quantity
                let quantities = JSON.parse(localStorage.getItem('item-quantity'));
                if (quantities.indexOf(quantities[j]) === j) {
                    quantities[j] = itemQuantity[j].innerHTML
                } else if (quantities.some(value => value === quantities[j])) {
                    quantities[j] = itemQuantity[j].innerHTML
                } else {
                    quantities.push(itemQuantity[j].innerHTML)
                }

                localStorage.setItem('item-quantity', JSON.stringify(quantities));

                let cartQuantities = localStorage.getItem('cart-quantity');
                cartQuantities --;
                cartQuantity.textContent = cartQuantities;
                localStorage.setItem('cart-quantity', cartQuantities);

                let totalCost = localStorage.getItem('total-cost');
                let itemPrice = parseFloat(itemQuantity[j].parentElement.previousElementSibling.children[1].textContent.slice(1));
                totalCost -= itemPrice;
                total.textContent = parseFloat(totalCost).toFixed(2);
                localStorage.setItem('total-cost', parseFloat(totalCost).toFixed(2));
            } else {
                return;
            }
        });
    };
}



// Delete item from cart
function deleteItems(data) {
    const deleteBtn = document.querySelectorAll('.delete');

    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', () => {
            let itemName = deleteBtn[i].previousElementSibling.previousElementSibling.textContent;
            let itemId = deleteBtn[i].parentElement.parentElement.getAttribute('data-id');
            let products = JSON.parse(localStorage.getItem('products'));
            const addBtn = document.querySelectorAll('.add-item');

            for (let l = 0; l < products.length; l++) {

                if (itemName === products[l].name || itemId === data[i].id) {
                    console.log(cartContent.children.length)
                    console.log(i);
                    
                    cartContent.children[l].remove();

                    for (let j = 0; j < data.length; j++) {
                        addBtn[j].innerHTML = `<i class="fas fa-cart-arrow-down"></i> ADD TO CART`;
                    }

                    let quantities = JSON.parse(localStorage.getItem('item-quantity'));
                
                    let cartQuantities = localStorage.getItem('cart-quantity');
                    cartQuantities -= parseInt(quantities[l]);
                    cartQuantity.textContent = parseInt(cartQuantities);
                    localStorage.setItem('cart-quantity', parseInt(cartQuantities));

                    let totalCost = localStorage.getItem('total-cost');
                    totalCost -= products[l].price * parseInt(quantities[l]);
                    total.textContent = parseFloat(totalCost).toFixed(2);
                    localStorage.setItem('total-cost', parseFloat(totalCost).toFixed(2));

                    quantities.splice(l, 1);
                    localStorage.setItem('item-quantity', JSON.stringify(quantities));

                    products.splice(l, 1);
                    localStorage.setItem('products', JSON.stringify(products));
                }
            } 
        });
    }
}
