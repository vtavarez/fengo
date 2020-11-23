import MiniCart from '../mini_cart';
import { toggleWarning, toggleSpinner, formatCurrency } from '../../utils';
class FeaturedCollection {
    constructor() {
        this.minicart = new MiniCart();
        this.tabs = document.querySelector('.featured-collection--tabs');
        this.collections = document.querySelector('.featured-collection--collections');
        this.tab = this.tabs?.children;
        this.collection = this.collections?.children;
        this.state = {
            chunk: 2,
            activeCollection: 0,
            productPrice: null,
            productVariants: null,
            productOptions2: null,
            productId: null,
            selectedOption1: null,
            selectedOption2: null,
            selectedVariant: null,
            option2Type: null,
        };

        this.tabs?.addEventListener('click', this.selectedCollection.bind(this));
        this.collections?.addEventListener('submit', this.addProductToCart.bind(this));
        this.collections?.addEventListener('click', this.dispatchAction.bind(this));
        this.collections?.addEventListener('keyup', this.dispatchAction.bind(this));
    }

    dispatchAction(evt) {
        evt.stopPropagation();
        if (evt.type === 'click' || evt.key === ' ') {
            if(evt.target.classList[0] === 'featured-collection--collections-collection-lazyload-button'){
                this.lazyLoad(evt);
            }
            if(evt.target.className === 'product--option1-input'){
                this.selectedOption1(evt);
            }
            if(evt.target.className === 'product--option2-input'){
                this.selectedOption2(evt);
            }
        }
    }

    resetState() {
        this.state.productOptions2?.replaceChildren();
        this.state = {
            ...this.state,
            productPrice: null,
            productVariants: null,
            productOption2: null,
            productId: null,
            selectedOption1: null,
            selectedOption2: null,
            selectedVariant: null,
            option2Type: null,
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

    selectedCollection(evt) {
        evt.stopPropagation();
        const selectedCollection = evt.target.dataset.collection;

        if (selectedCollection !== this.state.activeCollection) {
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
                ${formatCurrency(this.state.selectedVariant.compare_at_price)}
                </span>
                ${formatCurrency(this.state.selectedVariant.price)}
            `;
            return;
        }
        this
        .state
        .productPrice
        .textContent = formatCurrency(this.state.selectedVariant.price);
    }

    enableOption2() {
        const fragment = document.createDocumentFragment();
        const availableOptions2 = this
        .state
        .productVariants
        .filter(variant => {
            if(variant.available && variant.option1 === this.state.selectedOption1){
                return variant;
            }
        });
        const totalOptions2 = availableOptions2.length;

        if(!this
            .state
            .productOptions2 || this
            .state
            .productOptions2
            .className !== `product--option2-${this.state.productId}`
        ){
            this.state.productOptions2 = this
            .collection[this.state.activeCollection]
            .querySelector(`.product--option2-${this.state.productId}`);
        }

        for (let i = 0; i < totalOptions2; i++) {
            const { id, option2 } = availableOptions2[i];
            const label = document.createElement('label');
            label.setAttribute('tabindex', '0');
            label.className = 'product--option2-label';
            if (this.state.option2Type === 'Color') {
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
            if (this.state.option2Type === 'Size') {
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
        }

        this.state.productOptions2.replaceChildren(fragment);
    }

    selectedOption1(evt) {
        this.state.productId = evt.target.dataset.productId;
        this.state.productVariants = JSON.parse(evt.target.dataset.variants);
        this.state.selectedOption1 = evt.target.value;
        this.state.productOptions2 = Boolean(evt.target.dataset.option2);
        this.state.option2Type = evt.target.dataset.option2;

        if (this.state.productOptions2) {
           this.enableOption2();
           return;
        }

        this.state.selectedVariant = this
        .state
        .productVariants
        .find(variant => variant.available && variant.option1 === this.state.selectedOption1);

        this.updateProductDetails();
    }

    selectedOption2(evt) {
        this.state.selectedOption2 = evt.target.value;
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

    addProductToCart(evt) {
        evt.preventDefault();
        const submitter = evt.submitter;
        const productHasVariants = JSON.parse(evt.target.dataset.hasVariants);
        const product = {
            id: evt.target.dataset.productId,
            title: evt.target.dataset.productTitle,
            featured_image: evt.target.dataset.productImage,
            handle: evt.target.dataset.productHandle,
            price: evt.target.dataset.productPrice,
            compare_at_price: evt.target.dataset.productComparePrice,
        }

        if (productHasVariants && !this.state.selectedVariant) {
            if (product.id !== this.state.productId) {
                return toggleWarning('Please select options for the chosen product.');
            }
            if (!this.state.selectedOption2 && this.state.option2Type == 'Size') {
                return toggleWarning('Please select a Size option.');
            }
            if (!this.state.selectedOption2 && this.state.option2Type == 'Color') {
                return toggleWarning('Plase select a Color option.');
            }
        }

        toggleSpinner(submitter);

        if (this.state.selectedVariant) {
            this.minicart.addProduct({
                ...product,
                ...this.state.selectedVariant,
                title: product.title,
                featured_image: product.featured_image
            }, 1, () => {
                evt.target.reset();
                this.resetState();
                toggleSpinner(submitter);
            });
            return;
        }

        this.minicart.addProduct(product, 1, () => {
            evt.target.reset();
            this.resetState();
            toggleSpinner(submitter);
        });

    }

    lazyLoad(evt) {
        const totalChunks = parseInt(evt.target.dataset.totalChunks);
        const url = evt.target.dataset.url;
        const submitter = evt.target;
        const loader = evt.target.nextElementSibling;
        const collection = this.collection[this.state.activeCollection].firstElementChild;

        toggleSpinner(submitter);

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

            this.state.chunk < totalChunks ? this.state.chunk++ : button.setAttribute('disabled','disabled');

            toggleSpinner(submitter);
        });
    }
}

export default new FeaturedCollection();