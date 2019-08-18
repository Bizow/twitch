import {ReactiveVar} from "meteor/reactive-var";
import {HTTP} from "meteor/http";
import {toast} from "meteor/dg:toast";

Meteor.startup(function () {
    App.init();
});


export const App = {};

App.headers = {'Client-ID': 'h4sp00xafkzx30qzq729snrdz7z3gy'};

App.init = function(){

    Meteor.disconnect();

    this.getChannelStreams();
    /*
    var vp = document.getElementById('viewport');
    var initialScale = Math.max(screen.width, screen.height)/1920;
    vp.setAttribute('content','width=device-width, initial-scale=' + initialScale + ', maximum-scale=' + initialScale, + 'minimum-scale=' + initialScale);
    */
};

App.template = new ReactiveVar('ttvStreams');

App.showStreamList = new ReactiveVar(false);

App.ttvStreams = new Mongo.Collection(null);

App.channels = [
    {user_name: 'jericho', user_id: '10397006'},
    {user_name: 'shroud', user_id: '37402112'},
    {user_name: 'sodapoppin', user_id: '26301881'},
    {user_name: 'JoshOG', user_id: '54706574'},
    {user_name: 'summit1g', user_id: '26490481'},
    //{user_name: 'andymilonakis', user_id: '51858842'},
    //{user_name: 'drdisrespect', user_id: ''},
];

App.channel = new ReactiveVar(App.channels[0]);

App.getChannelStreams = function(){
    /*
    https://api.twitch.tv/helix/users?login=jericho

    {
      "id": "10397006",
      "login": "jericho",
      "display_name": "JERICHO",
      "type": "",
      "broadcaster_type": "partner",
      "description": "I livestream video games.",
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/1820996c246e3f2d-profile_image-300x300.png",
      "offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/53640fe57972be70-channel_offline_image-1920x1080.jpeg",
      "view_count": 26746563
    }

    https://api.twitch.tv/helix/streams?user_id=26301881&user_id=214062798

    {
      "id": "34553961600",
      "user_id": "26301881",
      "user_name": "sodapoppin",
      "game_id": "509663",
      "community_ids": [

      ],
      "type": "live",
      "title": "Dumb poop at Dreamhack | discord.gg/Gd9tU2N (Classic guild apps)",
      "viewer_count": 28596,
      "started_at": "2019-06-16T15:05:57Z",
      "language": "en",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sodapoppin-{width}x{height}.jpg",
      "tag_ids": [
        "2a14b52e-d459-4c92-be11-5d86b898f6b6",
        "6ea6bca4-4712-4ab9-a906-e3336a9d8039"
      ]
    }

    https://api.twitch.tv/helix/streams?first=20&after=eyJiIjp7Ik9mZnNldCI6MH0sImEiOnsiT2Zmc2V0Ijo0MH19
    * */

    const userIds = [];
    const userNames = [];
    App.channels.forEach((channel) =>{
        userIds.push(channel.user_id);
        userNames.push(channel.user_name);
    });
    //https://api.twitch.tv/helix/users?login=andymilonakis&login=btssmash
    const userIdQuery = userIds.join('&user_id=');
    const loginQuery = userNames.join('&login=');
    const usersUrl = `https://api.twitch.tv/helix/streams?user_id=${userIdQuery}`;
    const loginUrl = `https://api.twitch.tv/helix/users?login=${loginQuery}`;
    console.log(JSON.stringify({usersUrl,loginUrl}, undefined, 1));

    const headers = App.headers;
    const defaultStream = App.channel.get();

    HTTP.get(loginUrl, {headers}, function (error, result) {
        if(!error){
            const streams = result.data.data;
            streams.forEach(function (stream, i) {
                console.log(i,stream);
                if(stream.login === defaultStream.user_name){
                    stream.active = true;
                }
                //stream.thumbnail_url = stream.thumbnail_url.replace('{width}', 300).replace('{height}',200);
                App.ttvStreams.insert(stream);
            });
        }else{
            console.log(error);
        }
    });

    setTimeout(() => {
        HTTP.get(usersUrl, {headers}, function (error, result) {
            if(!error){
                const streams = result.data.data;
                streams.forEach(function (stream, i) {
                    console.log(i,stream);
                    stream.thumbnail_url = stream.thumbnail_url.replace('{width}', 300).replace('{height}',200);
                    App.ttvStreams.update({login: stream.user_name.toLocaleLowerCase()}, {
                        $set: {
                            thumbnail_url: stream.thumbnail_url,
                            title: stream.title
                        }
                    });
                });
            }else{
                console.log(error);
            }
        });
    },5000)
};

App.getAllStreams = function(page, after){
    page++;
    /*
    https://api.twitch.tv/helix/streams?first=20&after=eyJiIjp7Ik9mZnNldCI6MH0sImEiOnsiT2Zmc2V0Ijo0MH19
    * */
    const url = `https://api.twitch.tv/helix/streams`;

    const headers = App.headers;
    const params = {'first': 100};
    if(after){
        params.after = after;
    }

    const defaultChan = App.channel.get();

    HTTP.get(url, {headers,params}, function (error, result) {
        if(!error){
            const streams = result.data.data;
            const pagination = result.data.pagination;
            streams.forEach(function (stream, i) {
                console.log(`page: ${page} - ${i}`,stream);
                if(App.channels.indexOf(stream.user_name) > -1){
                    if(stream.user_name === defaultChan){
                        stream.active = true;
                    }
                    stream.thumbnail_url = stream.thumbnail_url.replace('{width}', 300).replace('{height}',200);
                    App.ttvStreams.insert(stream);
                }
            });
            if(streams.length > 0 && pagination){
                if(pagination.cursor){
                    setTimeout(() =>{
                        App.getStreams(page, pagination.cursor);
                    },5000);
                }else{
                    console.log('Missing pagination.cursor');
                }
            }else{
                console.log(`streams.length: ${streams.length} pagination: ${pagination}`);
            }
        }else{
            console.log(error);
        }
    });
};

App.toggleStreamList = function(){
    const cur = App.showStreamList.get();
    App.showStreamList.set(!cur);
};

App.next = function () {
    if(App.swiper){
        App.swiper.slideNext();
        const i = App.swiper.realIndex;
        const stream = App.channels[i];
        toast(`${i} - ${stream.user_name}`);
    }
};

App.back = function () {
    if(App.swiper){
        App.swiper.slidePrev();
        const i = App.swiper.realIndex;
        const stream = App.channels[i];
        toast(`${i} - ${stream.user_name}`);
    }
};

App.select = function () {
    if(App.swiper){
        const i = App.swiper.realIndex;
        const stream = App.channels[i];
        toast(`${i} - ${stream.user_name}`);
        App.ttvStreams.update({}, {$set: {active: false}}, {multi:true});
        setTimeout(() =>{
            App.ttvStreams.update({login: stream.user_name}, {$set: {active: true}});
        },1000);
    }
};

/**
 * XXX arrow buttons cause iframe to hijack control
 *        38
 *         ^
 *    37 <-13-> 39
 *         v
 *         40
 *
 *   X    X    X
 *   227  179  228
 *
 */
document.addEventListener("keydown", event => {
    Meteor.call('log', event.keyCode);

    if(event.keyCode === 179){//play,pause
        const cur = App.showStreamList.get();
        if(cur){
            App.select();
        }
        App.getChannelStreams();
        App.toggleStreamList();
    }
    if(event.keyCode === 13){//middle
        Meteor.reconnect();
    }

    if(event.keyCode === 228){//forward
       App.next();
    }

    if(event.keyCode === 227){//back
        App.back();
    }

    if(event.keyCode === 32){//back
        App.select();
    }

    if(event.keyCode === 38){//up
        App.showStreamList.set(true);
    }

    if(event.keyCode === 40){//down
        App.showStreamList.set(false);
    }

    if(event.keyCode === 37){//left
        App.back();
    }

    if(event.keyCode === 39){//right
        App.next();
    }

});