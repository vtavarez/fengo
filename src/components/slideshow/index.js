import { Swiper as SwiperClass, Pagination, Navigation } from 'swiper/swiper.esm';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';

SwiperClass.use([Pagination, Navigation])

const { directive } = getAwesomeSwiper(SwiperClass);

class Slideshow {
    constructor(id){
        this.sectionId = id;
        this.appType = 'vue-slideshow';
        this._appInstance = null;
        this._mountingNode = `#vue-slideshow-${id}`;
    }

    getSectionId(){
        return this.sectionId;
    }

    kill(){
        this._appInstance.kill();
    }

    init(){
        this._appInstance = new Vue({
            el: this._mountingNode,
            directives: {
                swiper: directive
            },
            data: {
                options: {
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets'
                    },
                    autoHeight: false,
                    keyboard: true
                },
                controls: {
                    prev: {
                        disable: true
                    },
                    next: {
                        disable: false
                    }
                },
                slideshow_links: {},
                slideshow_initializing: true
            },
            methods: {
                initialized(){
                    this.slideshow_initializing = false;
                },
                next() {
                    this.slideshow.slideNext(500);

                    if (!this.slideshow.isBeginning) {
                        this.controls.prev.disable = false;
                    }

                    if(this.slideshow.isEnd){
                        this.controls.next.disable = true;
                    }

                    this.activeSlideLink();
                },
                prev() {
                    this.slideshow.slidePrev(500);

                    if (!this.slideshow.isEnd) {
                        this.controls.next.disable = false;
                    }

                    if(this.slideshow.isBeginning){
                        this.controls.prev.disable = true;
                    }

                    this.activeSlideLink();
                },
                activeSlideLink() {
                    //* store active slide link
                    if(!this.slideshow_links[this.slideshow.activeIndex]){
                        this.slideshow_links[this.slideshow.activeIndex] = this.slideshow.slides[this.slideshow.activeIndex].querySelector('.swiper--link');
                    }
                    //* set previous slide link tabindex to -1
                    if(this.slideshow.previousIndex){
                        this.slideshow_links[this.slideshow.previousIndex].tabIndex = "-1";
                    }
                    //* set current slide link tabindex to 0
                    this.slideshow_links[this.slideshow.activeIndex].tabIndex = "0";
                },
                kill(){
                    this.$destroy();
                }
            },
            mounted() {
                if(this.slideshow.initialized){
                    this.initialized();
                }

                if (this.slideshow.slides.length > 0){
                    this.activeSlideLink();
                }
            },
            computed: {
                initializing(){
                    return {
                        'swiper--initializing': this.slideshow_initializing
                    }
                }
            }
        });
    }
}


export default Slideshow;