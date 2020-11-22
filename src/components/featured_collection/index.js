import MiniCart from '../mini_cart';
import { toggleWarning } from '../../utils';
class FeaturedCollection {
    constructor() {
        this.tabs = document.querySelector('.featured-collection--tabs');
        this.collections = document.querySelector('.featured-collection--collections');
        this.tab = this.tabs?.children;
        this.collection = this.collections?.children;
        this.state = {
            chunk: 2,
            activeCollection: 0,
            productPrice: null,
            productVariants: null,
            productOption2: null,
            productId: null,
            selectedOption1: null,
            selectedOption2: null,
            selectedVariant: null,
            option2Type: null
        };

        this.tabs?.addEventListener('click', this.selectedCollection.bind(this));
        this.collections?.addEventListener('submit', this.addProductToCart.bind(this));
        this.collections?.addEventListener('click', this.dispatchAction.bind(this));
        this.collections?.addEventListener('keyup', this.dispatchAction.bind(this));
    }

    dispatchAction(event) {
        event.stopPropagation();
        if (event.type === 'click' || event.key === ' ') {
            if(event.target.classList[0] === 'featured-collection--collections-collection-lazyload-button'){
                this.lazyLoad(event);
            }
            if(event.target.className === 'product--option1-input'){
                this.selectedOption1(event);
            }
            if(event.target.className === 'product--option2-input'){
                this.selectedOption2(event);
            }
        }
    }

    resetState() {
        this.state.productOption2?.replaceChildren();
        this.state = {
            ...this.state,
            productPrice: null,
            productVariants: null,
            productOption2: null,
            productId: null,
            selectedOption1: null,
            selectedOption2: null,
            selectedVariant: null,
            option2Type: null
        }
    }

    toggleCollection() {
        this
        .tab[this.state.activeCollection]
        .classList
        .toggle('featured-collection--tabs-tab-active');
        this
        .collection[this.state.activeCollection]
        .classList
        .toggle('featured-collection--collections-collection-active');
    }

    selectedCollection(event) {
        event.stopPropagation();
        const selectedCollection = event.target.dataset.collection;
        if(selectedCollection !== this.state.activeCollection){
            this.toggleCollection();
            this.state.activeCollection = selectedCollection;
            this.toggleCollection();
        }
    }

    updateProductDetails() {
        if(!this
            .state
            .productPrice || this
            .state
            .productPrice
            .className !== `product--details-price-${this.state.productId}`
        ){
            this.state.productPrice = this
            .collection[this.state.activeCollection]
            .querySelector(`.product--details-price-${this.state.productId}`);
        }
        if(this
            .state
            .selectedVariant
            .compare_at_price > 0
        ){
            this
            .state
            .productPrice
            .innerHTML = `
                <span class="product--details-price-compare">
                ${MiniCart.formatCurrency(this.state.selectedVariant.compare_at_price)}
                </span>
                ${MiniCart.formatCurrency(this.state.selectedVariant.price)}
            `;
            return;
        }
        this
        .state
        .productPrice
        .textContent = MiniCart.formatCurrency(this.state.selectedVariant.price);
    }

    enableOption2() {
        const fragment = document.createDocumentFragment();
        const availableOption2 = this
        .state
        .productVariants
        .filter(variant => {
            if(variant.available && variant.option1 === this.state.selectedOption1){
                return variant;
            }
        });

        if(!this
            .state
            .productOption2 || this
            .state
            .productOption2
            .className !== `product--option2-${this.state.productId}`
        ){
            this.state.productOption2 = this
            .collection[this.state.activeCollection]
            .querySelector(`.product--option2-${this.state.productId}`);
        }

        availableOption2
        .forEach(({ id, option2 }) => {
            const label = document.createElement('label');
            label.setAttribute('tabindex', '0');
            label.className = 'product--option2-label';
            if(this.state.option2Type === 'Color'){
                label.setAttribute('for', `color-${id}`)
                label.innerHTML = `
                    <input
                        class="product--option2-input"
                        id="color-${id}"
                        type="radio"
                        name="color"
                        value="${option2}"
                    >
                    <span style="background-color:${option2};"></span>
                `;
            }
            if(this.state.option2Type === 'Size'){
                label.setAttribute('for', `size-${id}`)
                label.innerHTML = `
                    <input
                        class="product--option2-input"
                        id="size-${id}"
                        type="radio"
                        name="size"
                        value="${option2}"
                    >
                    <span>
                        ${option2}
                    </span>
                `;
            }
            fragment.appendChild(label);
        });

        this.state.productOption2.replaceChildren(fragment);
    }

    selectedOption1(event) {
        this.state.productId = event.target.dataset.productId;
        this.state.productVariants = JSON.parse(event.target.dataset.variants);
        this.state.selectedOption1 = event.target.value;
        this.state.productOption2 = Boolean(event.target.dataset.option2);
        this.state.option2Type = event.target.dataset.option2;

        if (this.state.productOption2) {
           this.enableOption2();
           return;
        }

        this.state.selectedVariant = this
        .state
        .productVariants
        .find(variant => variant.available && variant.option1 === this.state.selectedOption1);

        this.updateProductDetails();
    }

    selectedOption2(event) {
        this.state.selectedOption2 = event.target.value;
        this.state.selectedVariant = this
        .state
        .productVariants
        .find(variant => {
            if(variant.option1 === this.state.selectedOption1){
                if(variant.option2 === this.state.selectedOption2){
                    return variant;
                }
            }
        });

        this.updateProductDetails();
    }

    addProductToCart(event) {
        event.preventDefault();
        const submitButton = event.submitter;
        const loader = submitButton.nextElementSibling;
        const hasOptions = JSON.parse(event.target.dataset.hasOptions);
        const product = {
            id: event.target.dataset.productId,
            title: event.target.dataset.productTitle,
            featured_image: event.target.dataset.productImage,
            handle: event.target.dataset.productHandle,
            price: event.target.dataset.productPrice,
            compare_at_price: event.target.dataset.productComparePrice
        }

        if (hasOptions) {
            if (!this.state.selectedVariant) {
                if (product.id !== this.state.productId) {
                    return toggleWarning('Please select options for the chosen product.');
                }
                if (!this.state.selectedOption2) {
                    if (this.state.option2Type == 'Size') {
                        return toggleWarning('Please select a Size option.');
                    }
                    if (this.state.option2Type == 'Color') {
                        return toggleWarning('Plase select a Color option.');
                    }
                }
            }
        }

        submitButton.classList.toggle('active');
        loader.classList.toggle('active');

        if (this.state.selectedVariant) {
            MiniCart.addProduct({
                ...product,
                ...this.state.selectedVariant,
                title: product.title,
                featured_image: product.featured_image
            }, 1);
            event.target.reset();
            this.resetState();
            submitButton.classList.toggle('active');
            loader.classList.toggle('active');
            return;
        }

        MiniCart.addProduct(product, 1);
        event.target.reset();
        this.resetState();
        submitButton.classList.toggle('active');
        loader.classList.toggle('active');
    }

    lazyLoad(event) {
        const totalChunks = parseInt(event.target.dataset.totalChunks);
        const url = event.target.dataset.url;
        const button = event.target;
        const loader = event.target.nextElementSibling;
        const collection = this.collection[this.state.activeCollection].firstElementChild;

        button
        .classList
        .remove('active');

        loader
        .classList
        .add('active');

        fetch(`${url}page=${this.state.chunk}`, {
            method: 'GET',
            headers: {'Content-Type': 'text/html'}
        })
        .then(res => res.text())
        .then(data => {
            const fragment = new DocumentFragment();
            const div = document.createElement('div');
            div.innerHTML = data;

            div
            .querySelectorAll('.featured-collection--collections-collection-product')
            .forEach(node => fragment.appendChild(node));

            collection.appendChild(fragment);

            this.state.chunk < totalChunks ? this.state.chunk : button.setAttribute('disabled','disabled');

            loader
            .classList
            .remove('active');

            button
            .classList
            .add('active');
        });
    }
}

export default new FeaturedCollection();