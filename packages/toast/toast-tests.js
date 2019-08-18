// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by toast.js.
import { name as packageName } from "meteor/dg:toast";

// Write your tests here!
// Here is an example.
Tinytest.add('toast - example', function (test) {
  test.equal(packageName, "toast");
});
