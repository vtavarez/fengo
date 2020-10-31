import { Swiper as SwiperClass, Pagination, Navigation } from 'swiper/swiper.esm';
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter';

SwiperClass.use([Pagination, Navigation])

const { directive } = getAwesomeSwiper(SwiperClass);

class GallerySlideshow {
    constructor(id){
        this.sectionId = id;
        this.appType = 'vue-gallery-slideshow';
        this._appInstance = null;
        this._mountingNode = `#vue-gallery-slideshow-${id}`;
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
                        el: '.content--slideshow-pagination',
                        type: 'bullets',
                        clickable: true,
                        bulletClass: 'content--slideshow-bullet',
                        bulletActiveClass: 'content--slideshow-bullet-active'
                    },
                    keyboard: true,
                    containerModifierClass: 'content--slideshow',
                },
                controls: {
                    prev: {
                        disable: true
                    },
                    next: {
                        disable: false
                    }
                }
            },
            methods: {
                next() {
                    this.slideshow.slideNext(500);

                    if (!this.slideshow.isBeginning) {
                        this.controls.prev.disable = false;
                    }

                    if(this.slideshow.isEnd){
                        this.controls.next.disable = true;
                    }
                },
                prev() {
                    this.slideshow.slidePrev(500);

                    if (!this.slideshow.isEnd) {
                        this.controls.next.disable = false;
                    }

                    if(this.slideshow.isBeginning){
                        this.controls.prev.disable = true;
                    }
                },
                kill(){
                    this.$destroy();
                }
            }
        });
    }
}

export default GallerySlideshow;