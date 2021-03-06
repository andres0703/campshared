const express = require('express')
const router = express.Router({mergeParams: true})
const Camp = require('../models/camp')
const Comment = require('../models/comment')
const middlewareObj = require('../middleware/index')


// display all camps
router.get('/', function (req, res) {
  Camp.find({}, function (err, allCamps) {
			  if (err) {
          req.flash('message', 'Something went wrong...')
				  console.log('Error fetching camps from database.')
				  console.log(err)
  } else {
		  res.render('camps/index', {campgrounds: allCamps, message: req.flash('message')})
  }
  })
})

// create new camp
router.post('/', middlewareObj.isLoggedIn, function (req, res) {
  var name = req.body.name
  var imageUrl = req.body.image
  var desc = req.body.description
  var author = {id: req.user._id, username: req.user.username}
  var newcamp = {name: name, image: imageUrl, description: desc, author: author}

  if (imageUrl != null) {
    Camp.create(newcamp, function (err, newlyCreated) {
				    if (err) {
              req.flash('message', 'Something went wrong...')
							console.log('Error creating database record: ')
						  console.log(err)
            } else {
						  res.redirect('/camps')
            }
    })
  };
})

// display create camp form
router.get('/new', middlewareObj.isLoggedIn, function (req, res) {
  res.render('camps/newcamp')
})

// display camp by id
router.get('/:id', function (req, res) {
  Camp.findById(req.params.id).populate('comments').exec(function (err, foundCamp) {
			  if (err) {
          req.flash('message', 'Something went wrong...')
					console.log(err)
  } else {
    res.render('camps/show', {campground: foundCamp })
  }
  })
})

// display edit camp form
router.get("/:id/edit", middlewareObj.checkCampOwner, function(req, res) {
  Camp.findById(req.params.id, function(err, campFound) {
    res.render("camps/edit", {camp: campFound})
  })
})

// edit camp
router.put("/:id", middlewareObj.checkCampOwner, function(req, res) {
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp) {
    res.redirect("/camps/" + req.params.id)
  })
})

// delete camp
router.delete("/:id", middlewareObj.checkCampOwner, function(req, res) {
  Camp.findByIdAndRemove(req.params.id, function(err) {
      console.log("camp removed")
      res.redirect("/camps")
  })
})

module.exports = router
