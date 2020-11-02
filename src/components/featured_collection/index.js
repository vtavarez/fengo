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
                disabled: false
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
                    const productId = e.currentTarget.dataset.productId;
                    const productTitle = e.currentTarget.dataset.productTitle;
                    const productImage = e.currentTarget.dataset.productImage;

                },
                lazyLoad(e){
                    const totalPages = e.currentTarget.dataset.totalPages;
                    const collection = e.currentTarget.dataset.collection;
                    const url = e.currentTarget.dataset.nextUrl.split('page=')[0];
                    const featuredCollection = document.querySelector(`.${collection}`);

                    let nextPage = 2;

                    this.loading = true;

                    fetch(`https://fengostore.myshopify.com${url}page=${nextPage}`, {
                        method: 'GET',
                        headers: {'Content-Type': 'text/html'}
                    })
                    .then(res => res.text())
                    .then(html => {
                        const shadowDOM = document.createElement('div');
                        shadowDOM.innerHTML = html;
                        const productNodes = shadowDOM.querySelectorAll('.featured-collection--product');
                        const products = document.createDocumentFragment();

                        productNodes.forEach(productNode => products.appendChild(productNode));

                        featuredCollection.appendChild(products);

                        nextPage < totalPages ? nextPage++ : this.disabled = true;

                        this.loading = false;
                    });
                },
                kill() {
                    this.$destroy();
                }
            },
            beforeMount() {
                self.appData.forEach((collection, i) => {
                    i === 0 ? this.collections[collection] = true : this.collections[collection] = false;
                });
            }
        });
    }
}

export default FeaturedCollection;