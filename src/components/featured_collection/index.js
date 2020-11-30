import { Product } from './Product';
import { toggleSpinner } from '../../utils';
export class FeaturedCollection {
    tabs;
    collections;
    tab;
    collection;
    product = new Product();
    state = {
        chunk: 2,
        activeCollection: 0,
    };

    constructor(sectionId) {
        this.tabs = document.getElementById(`featured-collection--tabs-${sectionId}`);
        this.collections = document.getElementById(`featured-collection--collections-${sectionId}`);
        this.tab = this.tabs?.children;
        this.collection = this.collections?.children;

        this.tabs?.addEventListener('click', this.selectedCollection.bind(this));
        this.collections?.addEventListener('submit', this.dispatchEvent.bind(this));
        this.collections?.addEventListener('click', this.dispatchEvent.bind(this));
        this.collections?.addEventListener('keyup', this.dispatchEvent.bind(this));
    }

    dispatchEvent(evt) {
        evt.stopPropagation();
        if (evt.type === 'submit') {
            this.product.addToCart(evt)
        }
        if (evt.type === 'click' || evt.key === ' ') {
            if (evt.target.classList[0] === 'featured-collection--collection-lazyload-button') {
                this.lazyLoad(evt);
            }
            if (evt.target.className === 'product--option1') {
                this.product.selectedOption1(evt);
            }
            if (evt.target.className === 'product--option2') {
                this.product.selectedOption2(evt);
            }
        }
    }

    toggleCollection() {
        this
        .tab[this.state.activeCollection]
        .classList
        .toggle('featured-collection--tab-active');
        this
        .collection[this.state.activeCollection]
        .classList
        .toggle('featured-collection--collection-active');
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

    lazyLoad(evt) {
        const totalChunks = parseInt(evt.target.dataset.totalChunks);
        const url = evt.target.dataset.url;
        const submitter = evt.target;
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
            .querySelectorAll('.featured-collection--collection-product')
            .forEach(node => fragment.appendChild(node));

            collection.appendChild(fragment);

            this.state.chunk < totalChunks ? this.state.chunk++ : submitter.setAttribute('disabled','disabled');

            toggleSpinner(submitter);
        });
    }

    init(){
        console.log('blah');
    }
}