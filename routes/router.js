const router = require('express').Router();
const database = include('databaseConnection');
const User = include('models/user');
const Pet = include('models/pet');
const Joi = require("joi");
const { faker } = require('@faker-js/faker');

router.get("/populateData", async (req, res) => {
	console.log("populate Data");
	try {
	let pet1 = new Pet({
	name: faker.name.firstName()
	});
	let pet2 = new Pet({
	name: faker.name.firstName()
	});
	await pet1.save();
	//pet1.id contains the newly created pet's id
	console.log(pet1.id);
	await pet2.save();
	//pet2.id contains the newly created pet's id
	console.log(pet2.id);
	let user = new User({
	first_name: faker.name.firstName(),
	last_name: faker.name.lastName(),
	email: faker.internet.email(this.first_name,this.last_name),
	password_hash: "thisisnotreallyahash",
	password_salt: "notagreatsalt",
	pets: [pet1.id, pet2.id]
	}
	);
	await user.save();
	//user.id contains the newly created user's id
	console.log(user.id);
	res.redirect("/");
	}
	catch(ex) {
	res.render('error', {message: 'Error'});
	console.log("Error");
	console.log(ex);
	}
	});

	router.get('/deleteUser', async (req, res) => {
		try {
		const schema = Joi.string().max(25).required();
			const validationResult = schema.validate(req.query.id);
			if (validationResult.error != null) {
			console.log(validationResult.error);
			throw validationResult.error;
			}
			await Pet.deleteMany({_id:{$in:req.query.id}}).exec();
			await User.deleteOne({_id: req.query.id}).exec();
			res.redirect("/");
		} catch (ex) {
			res.render('error', {message: 'Error'});
			console.log("Error");
			console.log(ex);
		}
	});

	router.post("/addUser", async(req, res)=> {
		try {
			await User.create({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				password_hash: "thisisnotreallyahash",
				password_salt: "notagreatsalt",
			});
			res.redirect("/");
			} catch (ex) {
			res.render('error', {message: 'Error'});
			console.log("Error");
			console.log(ex);
		}
	})

	router.get('/', async (req, res) => {
		console.log("page hit");
		try {
		const result = await User.find({})
		 .select('first_name last_name email id').exec();
		console.log(result);
		res.render('index', {allUsers: result});
		}
		catch(ex) {
		res.render('error', {message: 'Error'});
		console.log("Error");
		console.log(ex);
		}
		});

		router.get('/showPets', async (req, res) => {
			console.log("page hit");
			try {
			const schema = Joi.string().max(25).required();
			const validationResult = schema.validate(req.query.id);
			if (validationResult.error != null) {
			console.log(validationResult.error);
			throw validationResult.error;
			}
			const userResult = await User.findOne({_id: req.query.id})
			 .select('first_name id name ')
			.populate('pets').exec();
			console.log(userResult);
			res.render('pet', {userAndPets: userResult});
			}
			catch(ex) {
			res.render('error', {message: 'Error'});
			console.log("Error");
			console.log(ex);
			}
			});

module.exports = router;
