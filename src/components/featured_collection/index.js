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
        this.collections.addEventListener('click', this.lazyLoad.bind(this));
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
        const featuredCollection = this.collection[this.state.activeCollection].firstElementChild;


        e.target.classList.toggle('featured-collection--collections-collection-lazyload-active');
        e.target.nextElementSibling.classList.toggle('featured-collection--collections-collection-lazyload-active');

        fetch(`${url}page=${page}`, {
            method: 'GET',
            headers: {'Content-Type': 'text/html'}
        })
        .then(res => res.text())
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            const nodes = div.querySelectorAll('.featured-collection--collections-collection-product');
            const fragment = new DocumentFragment();

            nodes.forEach(node => fragment.appendChild(node));

            featuredCollection.appendChild(fragment);

            page < totalPages ? page++ : e.target.setAttribute('disabled','disabled');

            e.target.nextElementSibling.classList.toggle('featured-collection--collections-collection-lazyload-active');
            e.target.classList.toggle('featured-collection--collections-collection-lazyload-active');
        });
    }
}

export default new FeaturedCollection();