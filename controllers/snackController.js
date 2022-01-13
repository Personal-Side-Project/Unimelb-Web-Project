var Snack = require('../models/snacks');
/**
 * Get all snack (GET)
 */
exports.getAllSnacks = function (req, res) {
    Snack.find().exec((err, snacks) => {
        if (err) {
            res.status(400).json({ success: false, err: err })
        } else {
            res.status(200).json({ success: true, snacks: snacks })
        }
    })
};
/**
 * Find one snack by their name (GET) (FOR FUTURE ADDITIONAL USING)
 */
exports.getOneSnack = async (req, res) => {
    try {
        const oneSnack = await Snack.findOne({"snackName": req.params.snackName.toLowerCase()}).lean()
        if (oneSnack === null) {   // no Snack found in database
            res.status(404)
            return res.send("Snack not found")
        }
        return res.send(oneSnack)  // Snack was found
    } catch (err) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}
/**
 * Add an snack item (POST) (FOR FUTURE ADDITIONAL USING)
 */
exports.addSnack = async (req, res) => {
    const snack = new Snack(req.body)   // construct a new Snack object from body of POST
  
    try {
        let result = await snack.save()  // save new Snack object to database
        return res.send(result)           // return saved object to sender
    } catch (err) {   // error detected
        res.status(400)
        return res.send("Database insert failed")
    }
};
/**
 * Update an existing snack (FOR FUTURE ADDITIONAL USING)
 */
exports.updateSnack = async (req, res) => {
    const new_snack = req.body   // construct modified snack object from body of POST
  
    try {
      const snack = await Snack.findOne( {"snackName": req.body.snackName} )  // check that an snack with this Id already exists
      if (!snack) {    // if snack is not already in database, return an error
        res.status(400)
        return res.send("Snack not found in database")
      }
  
      Object.assign(snack, new_snack)   // replace properties that are listed in the POST body
      let result = await snack.save()    // save updated snack to database
      return res.send(result)             // return saved snack to sender
  
      } catch (err) {   // error detected
          res.status(400)
          return res.send("Database update failed")
      }
};
