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
  // Grabs all movies that where wishlist = true
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
    //Adds movie to library
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
    // Removes entry from library
    app.delete("/api/movies/:id", function (req, res) {
      const uid = req.user.id;
      db.Movie.destroy({
        where: {
          UserId: uid,
          id: req.params.id,
        },
      }).then(function (dbMovie) {
        res.json(dbMovie);
      }).catch(function (err) {
        res.status(500).json(err);
        console.log(req.body);
      });
    }),
    // Removes entry from wishlist
    app.delete("/api/wishlist/:id", function (req, res) {
      const uid = req.user.id;
      db.Movie.destroy({
        where: {
          UserId: uid,
          imdbID: req.params.id,
          wishlist: true
        },
      }).then(function (dbMovie) {
        res.json(dbMovie);
      }).catch(function (err) {
        res.status(500).json(err);
        console.log(req.body);
      });
    }),
    // app.put("/api/movies/:id", function (req, res) {
    //   const uid = req.user.id;
    //   db.Movie.update(
    //     {
    //       UserId: uid,
    //       format: req.body.format,
    //       wishlist: req.body.wishlist,
    //     },
    //     {
    //       where: { id: req.params.id },
    //     }
    //   ).then(function (dbMovie) {
    //     res.json(dbMovie);
    //   }).catch(function (err) {
    //     res.status(500).json(err);
    //     console.log(req.body);
    //   });
    // }),
    app.get("/api/wishlist/:id", function (req, res) {
      const uid = req.user.id;
      db.Movie.count({
        where: {
          UserId: uid,
          imdbID: req.params.id,
          wishlist: true,
        },
      }).then((dbMovie) => {
        res.json(dbMovie);
      }).catch(function(err) {
        res.status(500).json(err);
        console.log(req.body);
      });
    })
};
