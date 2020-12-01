import Swiper, { Pagination, Navigation } from 'swiper';

Swiper.use([Pagination, Navigation]);
export class Gallery {
    sectionId;
    mountingEl;
    slideshow;
    buttonPrev;
    buttonNext;
    settings = {
        keyboard: true,
        autoHeight: false,
        simulateTouch: false,
        containerModifierClass: 'gallery--slideshow-',
        slideClass: 'gallery--slideshow-slide',
        pagination: {
            el: '.gallery--slideshow-pagination',
            type: 'bullets',
            clickable: true,
            bulletClass: 'gallery--slideshow-bullet',
            bulletActiveClass: 'gallery--slideshow-bullet-active',
        },
    }

    constructor(sectionId) {
        this.mountingEl = document.querySelector(`#gallery-slideshow-${sectionId}`);
        this.buttonPrev = this.mountingEl?.querySelector(`#button-prev-${sectionId}`);
        this.buttonNext = this.mountingEl?.querySelector(`#button-next-${sectionId}`);
        this.mountingEl?.addEventListener('click', this.dispatchEvent.bind(this));
        this.slideshow = new Swiper(this.mountingEl, this.settings);
    }

    dispatchEvent(evt) {
        evt.stopPropagation();
        if (evt.target.className === 'gallery--slideshow-button-prev') {
            this.prev()
        }
        if (evt.target.className === 'gallery--slideshow-button-next') {
            this.next()
        }
    }

    next() {
        this.slideshow.slideNext(500);

        if (!this.slideshow.isBeginning) {
            this.buttonPrev.removeAttribute('disabled');
            this.buttonPrev.setAttribute('aria-disabled', 'false');
        }

        if(this.slideshow.isEnd){
            this.buttonNext.setAttribute('disabled', 'disabled');
            this.buttonNext.setAttribute('aria-disabled', 'true');
        }
    }

    prev() {
        this.slideshow.slidePrev(500);

        if (!this.slideshow.isEnd) {
            this.buttonNext.removeAttribute('disabled');
            this.buttonNext.setAttribute('aria-disabled', 'false');
        }

        if(this.slideshow.isBeginning){
            this.buttonPrev.setAttribute('disabled', 'disabled');
            this.buttonPrev.setAttribute('aria-disabled', 'true');
        }
    }

    init() {}

    getSectionId() {
        return this.sectionId;
    }

    kill() {
        this.slideshow.destroy();
        this.mountingEl.removeEventListener('click');
    }
}