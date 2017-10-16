var Zone = require("can-zone");
var dom = require("./can-simple-dom");
var canjs = require("./canjs");

var assert = require("assert");
var {
	createServer,
	Request,
	Response
} = require("./test-helpers");
var helpers = require("../test/helpers");

var canRoute = require("can-route");
var LOCATION = require("can-globals/location/location");

var spinUpServer = function(cb){
	return createServer(8070, function(req, res){
		switch(req.url) {
			case "/api/todos":
				var data = ["eat", "sleep"];
				break;
			case "/api/cart":
				var data = { count: 22 };
				break;
		}
		res.end(JSON.stringify(data));
	})
	.then(server => {
		return cb().then(() => server.close());
	});
};

describe("SSR Zones - CanJS application", function(){
	before(function(){
		return spinUpServer(() => {
			var request = new Request("/home");
			var response = this.response = new Response();

			var zone = this.zone = new Zone({
				plugins: [
					// Sets up a DOM
					dom(request),
					canjs(),
				]
			});

			return zone.run(function(){
				require("can-route-pushstate");
				canRoute("{page}", {});
				var loc = LOCATION();

				var params = canRoute.deparam(loc.pathname);
				var main = document.createElement("main");
				main.textContent = params.page;
				document.body.appendChild(main);
			});
		});
	});

	it("Includes the right HTML", function(){
		assert(this.zone.data.html);
		var dom = helpers.dom(this.zone.data.html);
		var main = helpers.find(dom, node => node.nodeName === "MAIN");

		assert.equal(main.firstChild.nodeValue, "home");
	});
});
