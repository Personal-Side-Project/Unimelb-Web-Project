const expect = require("chai").expect;

const testVendorsLocation = [
    { name: "vendor01", location: [1, 1] },
    { name: "vendor02", location: [1, 2] },
    { name: "vendor03", location: [2, 3] },
    { name: "vendor04", location: [3, 3] },
    { name: "vendor05", location: [3, 4] },
    { name: "vendor06", location: [1, 0] },
    { name: "vendor07", location: [4, 5] },
    { name: "vendor08", location: [5, 5] }
]

const testVendorsResults = [
    { name: 'vendor05', distance: 1 },
    { name: 'vendor01', distance: 1.189207115002721 },
    { name: 'vendor02', distance: 1.4953487812212205 },
    { name: 'vendor06', distance: 1.6817928305074292 },
    { name: 'vendor03', distance: 1.8988289221159418 }
]

// The unit tests
describe("unit tests", () => {
    it('return nearest five vendors', function (done) {
        let current = { "lat": 0, "lng": 0 }
        var vendors = []
        for (i = 0; i < testVendorsLocation.length; i++) {
            var distance = Math.sqrt(Math.hypot(
                current.lat - testVendorsLocation[i].location[0],
                current.lng - testVendorsLocation[i].location[1]))
            if (Number.isFinite(distance)) {
                vendors = push({ name: testVendorsLocation[i].name, distance: distance })
            }
        }
        vendors = vendors.sort(({ distance: a }, {diatance: b }) => a - b).slice(0, 5)
        expect(vendors).to.eql(testVendorsResult)
        done()
    })
})