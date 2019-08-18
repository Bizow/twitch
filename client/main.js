import {Template} from 'meteor/templating';
import {App} from "../imports/app";
import '/imports/ui/components/ttvStreams/ttvStreams.js';
import './main.html';

Template.body.helpers({
    template() {
        return App.template.get();
    },
    showStreams() {
        return App.showStreamList.get();
    },
});

Template.swiperMenu.onRendered(function () {

});

Template.swiperMenu.helpers({
    swiperOptions() {
        const slides = [];
        App.channels.forEach((chan) => {
            slides.push({
                template: 'streamSlide',
                stream: chan
            });
        });

        return {
            parent: App,
            containerClass: '',
            slides: slides,
            options: {
                loop:true,
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    }
});

Template.streamSlide.helpers({
    ttvStream(){
        const stream = this.stream;
        const ttvStream = App.ttvStreams.findOne({login: stream.user_name});
        console.log(ttvStream);
        return ttvStream;
    }
});

Template.ttvStream.helpers({
    stream(){
        return App.ttvStreams.findOne({active: true});
    }
});



