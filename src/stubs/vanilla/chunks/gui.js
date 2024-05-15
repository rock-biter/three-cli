const configs = {
	example: 5,
};

const gui = new dat.GUI();

gui.add(configs, 'example', 0, 10, 0.1).onChange((val) => console.log(val));
