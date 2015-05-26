var AppMap = require("can-ssr/app-map");
var QUnit = require("steal-qunit");

QUnit.module("can-ssr/app-map");

QUnit.module("pageData");

var keys = Object.keys || function(obj){
	var result = [];
	for (prop in obj) {
		result.push(prop);
	}
};

test("sorts correctly", function(){
	var map = new AppMap();
	map.pageData("foo", { "one": 1, "two": 2 }, {});
	map.pageData("foo", { "two": 2, "one": 1 }, {});

	equal(keys(map.__pageData).length, 1, "There is one key");
});
