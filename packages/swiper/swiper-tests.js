// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by swiper.js.
import { name as packageName } from "meteor/dg:swiper";

// Write your tests here!
// Here is an example.
Tinytest.add('swiper - example', function (test) {
  test.equal(packageName, "swiper");
});
