import MiniCart from '../mini_cart';
import { toggleWarning, toggleSpinner, formatCurrency } from '../../utils';

export class Product {
    priceElement;
    options2Element;

    state = {
        product: null,
        selectedOption1: null,
        selectedOption2: null,
        selectedVariant: null,
    };

    resetState() {
        this.options2Element?.replaceChildren();
        this.state = {
            product: null,
            selectedOption1: null,
            selectedOption2: null,
            selectedVariant: null,
        }
    }

    getProduct(handle, cb){
        const req = new Request(`/products/${handle}.js`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        fetch(req)
        .then(res => res.json())
        .then(product => cb(product))
    }

    updatePrice() {
        if (!this
            .priceElement || this
            .priceElement
            .id !== `product--price-${this.state.product.id}`
        ) {
            this.priceElement = document.getElementById(`product--price-${this.state.product.id}`);
        }

        if (this.state.selectedVariant.compare_at_price > 0) {
            this.priceElement.innerHTML = `
                <span class="product--details-price-compare">
                    ${formatCurrency(this.state.selectedVariant.compare_at_price)}
                </span>
                ${formatCurrency(this.state.selectedVariant.price)}
            `;
            return;
        }

        this.priceElement.textContent = formatCurrency(this.state.selectedVariant.price);
    }

    toggleOptions2() {
        const fragment = document.createDocumentFragment();
        const options2 = this.state.product.options[1].name;
        const options = this
        .state
        .product
        .variants
        .filter(variant => {
            if(variant.available && variant.option1 === this.state.selectedOption1){
                return variant;
            }
        });

        if(!this
            .options2Element || this
            .options2Element
            .id !== `product--options2-${this.state.product.id}`
        ){
            this.options2Element = document.getElementById(`product--options2-${this.state.product.id}`);
        }

        for (let i = 0; i < options.length; i++) {
            const { option2 } = options[i];
            const label = document.createElement('label');

            if (options2 === 'Color') {
                label.innerHTML = `
                    <input
                        class="product--option2"
                        type="radio"
                        name="color"
                        value="${option2}"
                    >
                    <span style="background-color:${option2};"></span>
                `;
            }

            if (options2 === 'Size') {
                label.innerHTML = `
                    <input
                        class="product--option2"
                        type="radio"
                        name="size"
                        value="${option2}"
                    >
                    <span>${option2}</span>
                `;
            }

            label.setAttribute('tabindex', '0');
            fragment.appendChild(label);
        }

        this.options2Element.replaceChildren(fragment);
    }

    selectedOption1(evt) {
        this.getProduct(evt.target.dataset.product, product => {
            this.state.product = product;
            this.state.selectedOption1 = evt.target.value;

            if (product.options.length > 1) {
               this.toggleOptions2();
               return;
            }

            this.state.selectedVariant = this
            .state
            .product
            .variants
            .find(variant => variant.available && variant.option1 === this.state.selectedOption1);

            this.updatePrice();
        });
    }

    selectedOption2(evt) {
        this.state.selectedOption2 = evt.target.value;
        this.state.selectedVariant = this
        .state
        .product
        .variants
        .find(variant => {
            if(variant.option1 === this.state.selectedOption1){
                if(variant.option2 === this.state.selectedOption2){
                    return variant;
                }
            }
        });

        this.updatePrice();
    }

    addToCart(evt) {
        evt.preventDefault();
        const form = evt.target;
        const submitter = evt.submitter;
        const hasVariants = JSON.parse(form.dataset.hasVariants);
        const productId = JSON.parse(form.dataset.productId);
        const option2 = this.state.product?.options[1].name;

        if (hasVariants && !this.state.selectedVariant) {
            if (productId !== this.state.product.id) {
                return toggleWarning('Please select options for the chosen product.');
            }
            if (!this.state.selectedOption2 && option2 === 'Size') {
                return toggleWarning('Please select a Size option.');
            }
            if (!this.state.selectedOption2 && option2 === 'Color') {
                return toggleWarning('Plase select a Color option.');
            }
        }

        toggleSpinner(submitter);

        if (this.state.selectedVariant) {
            MiniCart.addProduct({
                ...this.state.product,
                ...this.state.selectedVariant,
                title: this.state.product.title,
                featured_image: this.state.product.featured_image
            }, 1, () => {
                form.reset();
                this.resetState();
                toggleSpinner(submitter);
            });
            return;
        }

        this.getProduct(evt.target.dataset.product, product => {
            MiniCart.addProduct({
                ...product,
                ...product.variants[0],
                title: product.title,
                featured_image: product.featured_image
            }, 1, () => {
                form.reset();
                this.resetState();
                toggleSpinner(submitter);
            });
        });
    }
}