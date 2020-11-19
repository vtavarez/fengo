import MiniCart from '../mini_cart';
class FeaturedCollection {
    constructor() {
        this.tabs = document.querySelector('.featured-collection--tabs');
        this.collections = document.querySelector('.featured-collection--collections');
        this.tab = this.tabs.children;
        this.collection = this.collections.children;
        this.state = {
            activeCollection: 0,
            activeProductPrice: null,
            activeProductVariants: null,
            activeProductColors: null,
            activeProductId: null,
            selectedVariantSize: null,
            selectedVariantColor: null,
            selectedVariant: null
        };
        this.tabs.addEventListener('click', this.selectedCollection.bind(this));
        this.collections.addEventListener('submit', this.addProductToCart.bind(this));
        this.collections.addEventListener('click', e => {
            e.stopPropagation();
            if(e.target.classList[0] === 'featured-collection--collections-collection-lazyload-button'){
                this.lazyLoad(e);
            }
            if(e.target.className === 'product--options-sizes-size-input'){
                this.selectedProductSize(e);
            }
            if(e.target.className === 'product--options-colors-color-input'){
                this.selectedProductColor(e);
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

    selectedProductSize(e){
        this.state.activeProductId = e.target.dataset.id;
        this.state.activeProductVariants = JSON.parse(e.target.dataset.variants);
        this.state.selectedVariantSize = e.target.value;
        const availableColors = this
        .state
        .activeProductVariants
        .reduce((acc,variant) => {
            if(variant.available && variant.option1 === this.state.selectedVariantSize){
                acc.push(variant.option2);
            }
            return acc;
        },[]);

        if(!this
            .state
            .activeProductColors || this
            .state
            .activeProductColors
            .className !== `product--options-colors-${this.state.activeProductId}`
        ){
            this.state.activeProductColors = this
            .collection[this.state.activeCollection]
            .querySelector(`.product--options-colors-${this.state.activeProductId}`);
        }

        const fragment = new DocumentFragment();

        availableColors.forEach(color => {
            const label = document.createElement('label');
            label.className = 'product--options-colors-color';
            label.innerHTML = `
                <input class="product--options-colors-color-input" id="color" type="radio" name="color" value="${color}">
                <span style="background-color:${color};"></span>
            `;
            fragment.appendChild(label);
        });

        this.state.activeProductColors.replaceChildren(fragment);
    }

    selectedProductColor(e){
        this.state.selectedVariantColor = e.target.value;
        this.state.selectedVariant = this
        .state
        .activeProductVariants
        .find(variant => {
            if(variant.option1 === this.state.selectedVariantSize){
                if(variant.option2 === this.state.selectedVariantColor){
                    return variant;
                }
            }
        });

        if(!this
            .state
            .activeProductPrice || this
            .state
            .activeProductPrice
            .className !== `product--details-price-${this.state.activeProductId}`
        ){
            this.state.activeProductPrice = this
            .collection[this.state.activeCollection]
            .querySelector(`.product--details-price-${this.state.activeProductId}`)
        }

        if(this.state.selectedVariant.compare_at_price > 0){
            this.state.activeProductPrice.innerHTML = `
                <span class="product--details-price-compare">
                    ${MiniCart.formatCurrency(this.state.selectedVariant.compare_at_price)}
                </span>
                ${MiniCart.formatCurrency(this.state.selectedVariant.price)}
            `;
        } else {
            this.state.activeProductPrice.textContent = MiniCart.formatCurrency(this.state.selectedVariant.price);
        }
    }

    addProductToCart(e){
        e.preventDefault();
        // const product = e.target.dataset.product;
        // MiniCart.addProduct(JSON.parse(product), 1);
    }

    lazyLoad(e){
        const page = 2;
        const totalPages = e.target.dataset.totalPages;
        const url = e.target.dataset.url.split('page=')[0];
        const button = e.target;
        const loader = e.target.nextElementSibling;
        const collection = this.collection[this.state.activeCollection].firstElementChild;

        button.classList.toggle('featured-collection--collections-collection-lazyload-active');
        loader.classList.toggle('featured-collection--collections-collection-lazyload-active');

        fetch(`${url}page=${page}`, {
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

            page < totalPages ? page++ : button.setAttribute('disabled','disabled');

            loader.classList.toggle('featured-collection--collections-collection-lazyload-active');
            button.classList.toggle('featured-collection--collections-collection-lazyload-active');
        });
    }
}

export default new FeaturedCollection();