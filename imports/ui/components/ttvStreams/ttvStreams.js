import './ttvStreams.html';
import {Template} from "meteor/templating";
import {HTTP} from "meteor/http";
import {App} from "../../../app";

Template.ttvStreams.onRendered(function () {
    /*
    const embed = new Twitch.Embed("twitch-embed", {
        width: 960,
        height: 540,
        layout: 'video',
        channel: channels[curChannel]
    });

    embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
        player = embed.getPlayer();
        player.setVolume(1);
    });
    */


});

Template.ttvStreams.helpers({
    channel(){
        const stream = App.channel.get();
        console.log(stream);
        return stream.channel;
    }
});