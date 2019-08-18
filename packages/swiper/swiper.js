import { Template } from 'meteor/templating';
import Swiper from 'swiper';
import './swiper.html';

Template.swiper.onRendered(function () {
    const instance = this;
    const config = instance.data;
    config.parent.swiper = new Swiper('.swiper-container', config.options);
});