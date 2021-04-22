class Filter {
	constructor(data, types, count) {
		this.data = data;
		this.types = types;
		this.count = count;
		
		this.getValues = this.getValues.bind(this);
	}
	
	getItemTypeWithCount(data, type, {range}) {
		return this.mapItemByKey(data, type).reduce((acc, curr) => {
			if (!range) {
				if (acc.length === 0) {
					return [{[type]: curr, n: 1}]
				}
				
				if (acc[acc.length - 1][type] === curr) {
					acc[acc.length - 1].n += 1;
					return acc;
				}
				
				if (acc[acc.length - 1][type] !== curr) {
					return [...acc, {[type]: curr, n: 1}]
				}
			}
			
			if (range) {
				const {
					[type]: {
						min, max
					}
				} = range;
				const step = (max - min) / this.count || 1;
				if (acc.length === 0) {
					return [{[type]: {min: min, max: min + step, n: 1}}];
				}
				
				if (acc[acc.length - 1][type].max >= curr) {
					acc[acc.length - 1][type].n += 1;
					return acc;
				}
				if (acc[acc.length - 1][type].max < curr) {
					return [...acc, {[type]: {min: curr, max: curr + step > max ? max : curr + step, n: 1}}]
				}
			}
		}, []);
	}
	
	mapItemByKey(data, type) {
		return data.map(item => item[type]).sort((a, b) => {
			if (a < b) return -1;
			if (a > b) return 1;
			if (a === b) return 0;
		})
	}
	
	computeMinMax(items, type) {
		let min = items[0] || null;
		let max = items[0] || null;
		for (let i = 1; i < items.length; i++) {
			if (min > items[i]) min = items[i];
			if (max < items[i]) max = items[i];
		}
		return {
			[type]: {min, max}
		}
		
	}
	
	getValues() {
		const {data, types} = this;
		const obj = {};
		
		Object.keys(types).forEach(type => {
			let range = null;
			if (typeof data[0][type] === 'number') {
				range = Object.assign(this.computeMinMax(this.mapItemByKey(data, type), type));
			}
			obj[type] = this.getItemTypeWithCount(data, type, {range});
		});
		
		return obj;
	}
	
	getFilteredValues(data, {filter}) {
		const types = Object.keys(filter);
		let result = data;
		
		types.forEach(type => {
			result = this.filterItem(result, filter, type)
		})
		return result
	}
	
	filterItem(data, filter, type) {
		return data.filter(item => filter[type].includes(item[type]))
	}
}

module.exports = Filter;