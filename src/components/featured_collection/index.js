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
                collections: {}
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
                    const chunks = e.currentTarget.dataset.chunks;
                    const collection = e.currentTarget.dataset.collection;
                    const url = e.currentTarget.dataset.nextUrl;

                    const featuredCollection = document.querySelector(`.${collection}`);

                    fetch(`https://fengostore.myshopify.com${url}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'text/html'
                        }
                    })
                    .then(res => res.text())
                    .then(data => {
                        const fragment = document.createDocumentFragment();
                        const div = document.createElement('div');
                        div.innerHTML = data;
                        const nodes = div.querySelectorAll('.col-12 .col-md-3');

                        nodes.forEach(node => fragment.appendChild(node));

                        featuredCollection.appendChild(fragment);
                    });
                },
                kill() {
                    this.$destroy();
                }
            },
            beforeMount() {
                self.appData.forEach((collection, i) => {
                    if(i === 0){
                        this.collections[collection] = true;
                    } else {
                        this.collections[collection] = false;
                    }
                });
            }
        });
    }
}

export default FeaturedCollection;