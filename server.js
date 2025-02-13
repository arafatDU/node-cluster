const cluster = require("cluster");
const os = require("os");
const fs = require("fs");

const totalCPUs = os.cpus().length;

// console.log(totalCPUs);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const express = require("express");

	const app = express();
	const PORT = 8000;
	
	app.get("/", (req, res) => {
    fs.readFile("./sample.txt", (err, data) => {
      if (err) {
        console.log(err);
      }
      return res.json({message: `Hello from Express Server ${process.pid}`, data: `${data}`});
    });
  });
	
	app.listen(PORT, () => 
		console.log(`Server started at port ${PORT}`)
	);
}