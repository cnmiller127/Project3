const db = require("../models");

module.exports = function (app) {
  //Find all movies associated with user AND join their userID from users model
  app.get("/api/movies", async function (req, res) {
    const uid = req.user.id;
    db.Movie.findAll(
      { where: { UserId: uid, wishlist: false } },
      { include: db.User }
    )
      .then(function (dbMovie) {
        res.json(dbMovie);
      })
      .catch(function (err) {
        res.status(500).json(err);
        console.log(req.body);
      });
  }),
    app.get("/api/wishlist", async function (req, res) {
      const uid = req.user.id;
      db.Movie.findAll(
        { where: { UserId: uid, wishlist: true } },
        { include: db.User }
      )
        .then(function (dbMovie) {
          res.json(dbMovie);
        })
        .catch(function (err) {
          res.status(500).json(err);
          console.log(req.body);
        });
    }),
    // grabs all movies of specified format and not in wishlist
    app.get("/api/movies/:format", async function (req, res) {
      const uid = req.user.id;
      const format = req.params.format;
      db.Movie.findAll(
        { where: { UserId: uid, format: format, wishlist: false } },
        { include: db.User }
      )
        .then(function (dbMovie) {
          res.json(dbMovie);
        })
        .catch(function (err) {
          res.status(500).json(err);
          console.log(req.body);
        });
    }),
    // grabs movie with specific id
    app.get("/api/movies/:id", function (req, res) {
      const uid = req.user.id;
      const id = req.params.id;
      db.Movie.findOne({ where: { UserId: uid, id: id } }, { include: db.User })
        .then(function (dbMovie) {
          res.json(dbMovie);
        })
        .catch(function (err) {
          res.status(500).json(err);
          console.log(req.body);
        });
    }),
    app.post("/api/movies", async function (req, res) {
      const uid = req.user.id;
      req.body.UserId = uid;
      db.Movie.create(req.body)
        .then(function (dbMovie) {
          res.json(dbMovie);
        })
        .catch(function (err) {
          res.status(500).json(err);
          console.log(req.body);
        });
    }),
    app.delete("/api/movies/:id", function (req, res) {
      db.Movie.destroy({
        where: { id: req.params.id },
      }).catch(function (err) {
        res.status(500).json(err);
        console.log(req.body);
      });
    }),
    app.update("/api/movies/:id", function (req, res) {
      db.Movie.update({
        format: req.body.format,
        wishlist: req.body.wishlist
      },{
        where: { id: req.params.id },
      }).catch(function (err) {
        res.status(500).json(err);
        console.log(req.body);
      })
    })
};
