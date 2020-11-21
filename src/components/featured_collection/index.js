import MiniCart from '../mini_cart';
import { toggleWarning } from '../../utils';
class FeaturedCollection {
    constructor() {
        this.tabs = document.querySelector('.featured-collection--tabs');
        this.collections = document.querySelector('.featured-collection--collections');
        this.tab = this.tabs.children;
        this.collection = this.collections.children;
        this.state = {
            chunk: 2,
            activeCollection: 0,
            productPrice: null,
            productVariants: null,
            productOption2: null,
            productId: null,
            selectedOption1: null,
            selectedOption2: null,
            selectedVariant: null
        };
        this.tabs.addEventListener('click', this.selectedCollection.bind(this));
        this.collections.addEventListener('submit', this.addProductToCart.bind(this));
        this.collections.addEventListener('click', e => {
            e.stopPropagation();
            if(e.target.classList[0] === 'featured-collection--collections-collection-lazyload-button'){
                this.lazyLoad(e);
            }
            if(e.target.className === 'product--option1-input'){
                this.selectedOption1(e);
            }
            if(e.target.className === 'product--option2-input'){
                this.selectedOption2(e);
            }
        });
    }

    toggleCollection(){
        this
        .tab[this.state.activeCollection]
        .classList
        .toggle('featured-collection--tabs-tab-active');
        this
        .collection[this.state.activeCollection]
        .classList
        .toggle('featured-collection--collections-collection-active');
    }

    selectedCollection(e) {
        e.stopPropagation();
        const selectedCollection = e.target.dataset.collection;
        if(selectedCollection !== this.state.activeCollection){
            this.toggleCollection();
            this.state.activeCollection = selectedCollection;
            this.toggleCollection();
        }
    }

    updateProductDetails(){
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

    enableOption2(optionType){
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

        const fragment = document.createDocumentFragment();

        availableOption2
        .forEach(({ id, option2 }) => {
            const label = document.createElement('label');
            label.className = 'product--option2-label';
            if(optionType === 'Color'){
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
            if(optionType === 'Size'){
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

    selectedOption1(e){
        this.state.productId = e.target.dataset.productId;
        this.state.productVariants = JSON.parse(e.target.dataset.variants);
        this.state.selectedOption1 = e.target.value;
        this.state.productOption2 = Boolean(e.target.dataset.option2);
        const optionType = e.target.dataset.option2;

        if(this.state.productOption2){
           this.enableOption2(optionType);
           return;
        }

        this.state.selectedVariant = this
        .state
        .productVariants
        .find(variant => variant.available && variant.option1 === this.state.selectedOption1);

        this.updateProductDetails();
    }

    selectedOption2(e){
        this.state.selectedOption2 = e.target.value;
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

    addProductToCart(e){
        e.preventDefault();

        if (this.state.productId) {
            if (!this.state.selectedVariant && !this.state.selectedOption1) {
               return toggleWarning('Please select a color.');
            } else if (!this.state.selectedVariant && !this.state.selectedOption2) {
                return toggleWarning('Please select a size.');
            }
        }

        if (this.state.productId) {
            if (this.state.productId !== e.target.dataset.productId) {
                return toggleWarning('Please select a color.');
            }
        }

        const product = {
            id: e.target.dataset.productId,
            title: e.target.dataset.productTitle,
            featured_image: e.target.dataset.productImage,
            handle: e.target.dataset.productHandle,
            price: e.target.dataset.productPrice,
            compare_at_price: e.target.dataset.productComparePrice
        }

        if(this.state.selectedVariant){
            const {
                id,
                price,
                compare_at_price,
                option1,
                option2,
                sku
            } =  this.state.selectedVariant;

            MiniCart.addProduct({
                ...product,
                id,
                price,
                compare_at_price,
                option1,
                option2,
                sku
            }, 1);

            return;
        }

        MiniCart.addProduct(product, 1);
    }

    lazyLoad(e){
        const totalChunks = parseInt(e.target.dataset.totalChunks);
        const url = e.target.dataset.url.split('page=')[0];
        const button = e.target;
        const loader = e.target.nextElementSibling;
        const collection = this.collection[this.state.activeCollection].firstElementChild;

        button
        .classList
        .remove('featured-collection--collections-collection-lazyload-active');

        loader
        .classList
        .add('featured-collection--collections-collection-lazyload-active');

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
            .remove('featured-collection--collections-collection-lazyload-active');

            button
            .classList
            .add('featured-collection--collections-collection-lazyload-active');
        });
    }
}

export default new FeaturedCollection();