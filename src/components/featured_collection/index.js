import MiniCart from '../mini_cart';
class FeaturedCollection {
    constructor() {
        this.tabs = document.querySelector('.featured-collection--tabs');
        this.collections = document.querySelector('.featured-collection--collections');
        this.tab = this.tabs.children;
        this.collection = this.collections.children;
        this.state = {
            activeCollection: 0,
            loading: false,
            disabled: false
        };
        this.tabs.addEventListener('click', this.selectedCollection.bind(this));
        this.collections.addEventListener('submit', this.addProductToCart.bind(this));
        this.collections.addEventListener('click', (e) => {
            e.stopPropagation();
            if(e.target.classList[0] == 'featured-collection--collections-collection-lazyload-button') {
                this.lazyLoad(e);
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

    addProductToCart(e){
        e.preventDefault();
        console.log(e.target);
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