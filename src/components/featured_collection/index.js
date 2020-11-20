import MiniCart from '../mini_cart';
class FeaturedCollection {
    constructor() {
        this.successBar = document.querySelector('.notification-bar-success');
        this.warningBar = document.querySelector('.notification-bar-warning');
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

    selectedOption1(e){
        this.state.productId = e.target.dataset.productId;
        this.state.productVariants = JSON.parse(e.target.dataset.variants);
        this.state.selectedOption1 = e.target.value;
        this.state.productOption2 = Boolean(e.target.dataset.option2);
        const optionType = e.target.dataset.option2;

        if(this.state.productOption2){
            const availableOption2 = this
            .state
            .productVariants
            .reduce((acc,variant) => {
                if(variant.available && variant.option1 === this.state.selectedOption1){
                    acc.push(variant.option2);
                }
                return acc;
            },[]);

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
            .forEach(option2 => {
                const label = document.createElement('label');
                label.className = 'product--option2-label';
                if(optionType === 'Color'){
                    label.innerHTML = `
                        <input
                            class="product--option2-input"
                            id="color"
                            type="radio"
                            name="color"
                            value="${option2}"
                        >
                        <span style="background-color:${option2};"></span>
                    `;
                }
                if(optionType === 'Size'){
                    label.innerHTML = `
                        <input
                            class="product--option2-input"
                            id="size"
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
        if (!this.state.selectedOption1) {
            this.warningBar.textContent = 'Please select a color.';
            this.warningBar.classList.toggle('notification-bar-active');
            setTimeout(() => {
                this.warningBar.classList.toggle('notification-bar-active');
            }, 1000);
        } else if (!this.state.selectedOption2) {
            alert('Please slelect a size');
        }
        // MiniCart.addProduct(JSON.parse(product), 1);
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