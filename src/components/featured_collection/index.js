import MiniCart from '../mini_cart';
class FeaturedCollection {
    constructor(id, data) {
        this.sectionId = id;
        this.appType = 'vue-featured-collection';
        this.appData = data;
        this._appInstance = null;
        this._mountingNode = `#vue-featured-collection-${id}`;
    }

    getSectionId() {
        return this.sectionId;
    }

    kill() {
        this._appInstance.kill();
    }

    init() {
        const self = this;

        this._appInstance = new Vue({
            el: this._mountingNode,
            data: {
                collections: {},
                loading: false,
                disabled: false,
                minicart: new MiniCart()
            },
            methods: {
                collectionSelected(e) {
                    const selectedCollection = e.target.dataset.collection;
                    for(let collection in this.collections){
                        this.collections[collection] = false;
                    }
                    this.collections[selectedCollection] = true;
                    this.$forceUpdate();
                },
                addProductToCart(e){
                    const product = e.currentTarget.dataset.product;
                    this.minicart.addProduct(JSON.parse(product), 1);
                },
                lazyLoad(e){
                    const page = 2;
                    const totalPages = e.currentTarget.dataset.totalPages;
                    const collection = e.currentTarget.dataset.collection;
                    const url = e.currentTarget.dataset.url.split('page=')[0];
                    const featuredCollection = document.querySelector(`.${collection}`);


                    this.loading = true;

                    fetch(`${url}page=${page}`, {
                        method: 'GET',
                        headers: {'Content-Type': 'text/html'}
                    })
                    .then(res => res.text())
                    .then(data => {
                        const div = document.createElement('div');
                        div.innerHTML = data;
                        const nodes = div.querySelectorAll('.featured-collection--product');
                        const fragment = document.createDocumentFragment();

                        nodes.forEach(node => fragment.appendChild(node));

                        featuredCollection.appendChild(fragment);

                        page < totalPages ? page++ : this.disabled = true;

                        this.loading = false;
                    });
                },
                kill() {
                    this.$destroy();
                }
            },
            beforeMount() {
                self.appData.forEach((collection, index) => {
                    index === 0 ? this.collections[collection] = true : this.collections[collection] = false;
                });
            }
        });
    }
}

export default FeaturedCollection;