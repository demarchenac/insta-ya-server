import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get(['/', '/:name'], (req, res) => {
	const greeting = '<h1>Hello From Node on Fly!</h1>';
	const name = req.params['name'];
	if (name) {
		res.send(greeting + '</br>and hello to ' + name);
	} else {
		res.send(greeting);
	}
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`InstaYa app listening on port ${port}!`));
