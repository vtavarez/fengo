import { Swiper, Pagination, Navigation } from 'swiper/swiper.esm';

Swiper.use([Pagination, Navigation]);
export class Gallery {
    slideshow;
    prevButton;
    nextButton;

    constructor(sectionId) {
        this.slideshow = document.getElementById(`gallery-slideshow-${sectionId}`);
        this.prevButton = this.slideshow.querySelector('.swiper--button-prev');
        this.nextButton = this.slideshow.querySelector('.swiper--button-next');

        new Swiper(this.slideshow, {
            pagination: {
                el: '.content--slideshow-pagination',
                type: 'bullets',
                clickable: true,
                bulletClass: 'content--slideshow-bullet',
                bulletActiveClass: 'content--slideshow-bullet-active',
            },
            keyboard: true,
            containerModifierClass: 'content--slideshow',
        });

        this.slideshow?.addEventListener('click', this.dispatchEvent.bind(this));

        // this.slideshow = this.slideshow?.swiper;
    }

    dispatchEvent(evt) {
        if (evt.target.className === 'swiper--button-prev') {
            this.prev()
        }
        if (evt.target.className === 'swiper--button-next') {
            this.next()
        }
    }

    next() {
        this.slideshow.slideNext(500);

        if (!this.slideshow.isBeginning) {
            this.prevButton.removeAttribute('disabled');
        }

        if (this.slideshow.isEnd) {
            this.nextButton.addAttribute('disabled');
        }
    };

    prev() {
        this.slideshow.slidePrev(500);

        if (!this.slideshow.isEnd) {
            this.nextButton.removeAttribute('disabled');
        }

        if (this.slideshow.isBeginning) {
            this.prevButton.addAttribute('disabled');
        }
    };

    init() {
        console.log('blah');
    }

    kill() {
        this.slideshow.removeEventListener('click');
    }
}