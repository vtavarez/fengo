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