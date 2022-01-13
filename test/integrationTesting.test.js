const expect = require('chai').expect;
const request = require('request');
const app = require('../app');

const baseUrl = "http://localhost:5000/vendor"

// initialise the testing content
const testVendorPark = {
    validBody: {
        status: "open",
        "location": [-37.79599776855707, 144.95977806871454],
        "textAddress": "TEST"
    }
}

// test vendor ID
const testVendorId = "60b1fe7b50629c0b5ffbf3ac"

// The integration test
describe("vendor integration tests", () => {
    it('the van operator should successfully set the status of their van', function (done) {
        request.post(
            {
                headers: { 'content-type': 'application/json' },
                url: baseUrl + '/park/' +testVendorId,
                body: testVendorPark.validBody,
                json: true,
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body.updatedVendor.status).to.be.a("open");
                if (error) done(error);
                else done();
            }
        );
    })
})