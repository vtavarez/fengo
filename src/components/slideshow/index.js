import Swiper, { Pagination, Navigation } from 'swiper';

Swiper.use([Pagination, Navigation]);
export class Slideshow {
    sectionId;
    mountingEl;
    slideshow;
    buttonPrev;
    buttonNext;
    settings = {
        keyboard: true,
        autoHeight: false,
        simulateTouch: false,
        containerModifierClass: 'slideshow-',
        slideClass: 'slideshow--slide',
        pagination: {
            el: '.slideshow--pagination',
            type: 'bullets',
            clickable: false,
            bulletClass: 'slideshow--pagination-bullet',
            bulletActiveClass: 'slideshow--pagination-bullet-active',
        },
        on: {
            init: this.initialized.bind(this),
            slideChange: this.activeSlideLink.bind(this),
        },
    }
    state = {
        slideshow_links: {}
    }

    constructor(sectionId) {
        this.sectionId = sectionId;
        this.mountingEl = document.querySelector(`#slideshow-${sectionId}`);
        this.buttonPrev = this.mountingEl?.querySelector(`#button-prev-${sectionId}`);
        this.buttonNext = this.mountingEl?.querySelector(`#button-next-${sectionId}`);
        this.mountingEl?.addEventListener('click', this.dispatchEvent.bind(this));
        this.slideshow = new Swiper(this.mountingEl, this.settings);
    }

    dispatchEvent(evt) {
        evt.stopPropagation();
        if(evt.target.className === 'slideshow--button-prev') {
            this.prev()
        }
        if (evt.target.className === 'slideshow--button-next') {
            this.next();
        }
    }

    initialized() {
        this.mountingEl.querySelector('.swiper-wrapper')
        .classList.remove('slideshow--initializing');
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

        this.activeSlideLink();
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

        this.activeSlideLink();
    }

    activeSlideLink() {
        //* store active slide link
        if(!this.state.slideshow_links[this.slideshow.activeIndex]){
            this.state.slideshow_links[this.slideshow.activeIndex] = this.slideshow
            .slides[this.slideshow.activeIndex]
            .querySelector('.slideshow--slide-content-link');
        }
        //* set previous slide link tabindex to -1
        if(this.slideshow.previousIndex){
            this.state.slideshow_links[this.slideshow.previousIndex].tabIndex = "-1";
        }
        //* set current slide link tabindex to 0
        this.state.slideshow_links[this.slideshow.activeIndex].tabIndex = "0";
    }

    init(){}

    getSectionId() {
        return this.sectionId;
    }

    kill() {
        this.slideshow.destroy();
        this.mountingEl.removeEventListener('click');
    }
}