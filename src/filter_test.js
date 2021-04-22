const Filter = require("./filter");
const data = require('./data.json');
const types = require('./types.json');

const filter = new Filter(data, types, 5);

console.time('Establish Time');

// const values = filter.getValues();
const opt = {
	filter: {
		nfc: [
			true
		],
		year: [2011],
		screen_size: [4.3],
		cores: [15]
	}
}
const filteredValues = filter.getFilteredValues(data, opt);
console.log(filteredValues);

console.timeEnd('Establish Time');