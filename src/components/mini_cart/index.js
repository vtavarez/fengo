class MiniCart {
    constructor(){
        this.cart = document.querySelectorAll('.minicart--products');
        this.shipping = document.querySelectorAll('.minicart--totals-shipping');
        this.total = document.querySelectorAll('.minicart--totals-cart');
        this.currency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2
        });
        this.state = JSON.parse(localStorage.getItem('minicart')) ?? {
            open: false,
            cart: {},
            total: 0
        };
        this.cart.forEach(cart => {
            cart.addEventListener('click', (e) => {
                e.stopPropagation();
                switch (e.target.className) {
                    case 'minicart--remove-icon':
                        return this.removeProduct(e.target.dataset.productId);
                    case 'minicart--increase-quantity-btn':
                        return this.increaseQuantity(e.target.parentElement.dataset.productId);
                    case 'minicart--decrease-quantity-btn':
                        return this.decreaseQuantity(e.target.parentElement.dataset.productId);
                    default:
                        break;
                }
            });
        });

        this.render();
    }

    static addProduct(product, qty){
        if(!this.state.cart[product.id]){
            this.state.total += (product.price * qty);
            this.state.cart[product.id] = product;
            this.state.cart[product.id].quantity = qty;

            fetch('/cart/add.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json '},
                body: JSON.stringify({ items: [{ ...product }] })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });

            this.render();
        }
    }

    static removeProduct(productId){
        if(this.state.cart[productId]){
            this.state.total -= (this.state.cart[productId].price * this.state.cart[productId].quantity);
            delete this.state.cart[productId];

            fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates: { productId: 0 }})
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
            })

            this.render();
        }
    }

    static updateProduct(productId, quantity){
        if(this.state.cart[productId]){
            if(quantity > this.state.cart[productId].quantity){
                this.state.total += (this.state.cart[productId].price * (quantity - this.state.cart[productId].quantity));
                this.state.cart[productId].quantity = quantity;
            }
            if(quantity < this.state.cart[productId].quantity){
                this.state.total -= (this.state.cart[productId].price * (this.state.cart[productId].quantity - quantity));
                this.state.cart[productId].quantity = quantity;
            }


            fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates: { productId: this.state.cart[productId].quantity }})
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });

            this.render();
        }
    }

    _increaseQuantity(productId){
        const quantity = this.state.cart[productId].quantity + 1;
        this.updateProduct(productId, quantity);
    }

    _decreaseQuantity(productId){
        if(this.state.cart[productId].quantity > 1){
            const quantity = this.state.cart[productId].quantity - 1;
            this.updateProduct(productId, quantity);
        }
    }

    _render(){
        const cart = Object.values(this.state.cart);
        let products = '';

        for (let product of cart){
            products += `
                <div class="minicart--product">
                    <div class="row">
                        <div class="col-4">
                            <img
                                class="minicart--product-img"
                                src="${product.featured_image}"
                                alt="${product.handle}"
                            />
                        </div>
                        <div class="col-6 no-padding">
                            <p class="minicart--product-title" aria-label="product name">
                                ${product.title}
                            </p>
                            <div class="minicart--product-quantity" data-product-id="${product.id}">
                                <button
                                    class="minicart--decrease-quantity-btn"
                                    aria-label="decrease quantity"
                                >
                                    <span aria-hidden="true">
                                        <svg
                                            version="1.1"
                                            id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            x="0px"
                                            y="0px"
                                            viewBox="0 0 409.6 409.6"
                                            style="enable-background:new 0 0 409.6 409.6;"
                                            xml:space="preserve"
                                        >
                                            <g>
                                                <path
                                                    d="M392.533,187.733H17.067C7.641,187.733,0,195.374,0,204.8s7.641,17.067,17.067,17.067h375.467 c9.426,0,17.067-7.641,17.067-17.067S401.959,187.733,392.533,187.733z" />
                                            </g>
                                        </svg>
                                    </span>
                                </button>
                                <input
                                    class="minicart--quantity"
                                    min="1"
                                    type="number"
                                    value="${product.quantity}"
                                    readonly
                                >
                                <button
                                    class="minicart--increase-quantity-btn"
                                    aria-label="increase quantity"
                                >
                                    <span aria-hidden="true">
                                        <svg
                                            version="1.1"
                                            id="Capa_1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            x="0px"
                                            y="0px"
                                            viewBox="0 0 341.4 341.4"
                                            style="enable-background:new 0 0 341.4 341.4;"
                                            xml:space="preserve"
                                        >
                                            <g><polygon points="192,149.4 192,0 149.4,0 149.4,149.4 0,149.4 0,192 149.4,192 149.4,341.4 192,341.4 192,192 341.4,192 341.4,149.4" /></g>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <p class="minicart--product-price">
                                ${product.price < product.compare_at_price_max ? (
                                    `<span aria-label="product price" class="strikeout-price">
                                        ${this.currency.format(product.compare_at_price_max * 0.01)}
                                    </span>
                                    <span aria-label="product sale price" class="price">
                                        ${this.currency.format(product.price * 0.01)}
                                    </span>`
                                ) : (
                                    `<span aria-label="product sale price" class="price">
                                        ${this.currency.format(product.price * 0.01)}
                                    </span>`
                                    )
                                }
                            </p>
                        </div>
                        <div class="col-2">
                            <button
                                aria-label="remove product"
                                class="minicart--remove-icon"
                                data-product-id="${product.id}"
                            >
                                <span aria-hidden="true">
                                    <svg
                                        version="1.1"
                                        id="Capa_1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 512.001 512.001"
                                        style="enable-background:new 0 0 512.001 512.001;"
                                        xml:space="preserve"
                                    >
                                        <g>
                                            <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
                                                L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
                                                c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
                                                l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
                                                L284.286,256.002z" />
                                        </g>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        this.cart.forEach(cart => { cart.innerHTML = products; });
        this.total.forEach(total => { total.textContent = this.currency.format(this.state.total * 0.01)});
        localStorage.setItem('minicart', JSON.stringify(this.state));
    }
}

export default MiniCart;