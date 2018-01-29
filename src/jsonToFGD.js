function numberOrString(value) {
	return Number.isInteger(parseInt(value)) ? parseInt(value) : `"${value}"`
}
function hasStrings(values) {
	let hasStrings = false
	for(let index in values)
		if(typeof numberOrString(values[index]) === 'string')
			hasStrings = true
	return hasStrings
}

module.exports = fgd => {
	let outFGD = ''

	// INCLUDES
	for(let includeIndex in fgd.includes)
		outFGD += `@include "${fgd.includes[includeIndex]}"\n`
	if(fgd.includes && fgd.includes.length > 0)
		outFGD += '\n'

	// ENTITIES
	for(let entIndex in fgd.entities) {
		let entity = fgd.entities[entIndex]
		let line = ''

		let params = ''
		for(let paramIndex in entity.parameters) {
			let param = entity.parameters[paramIndex]
			let paramContent = ''

			for(let valueIndex = 0; valueIndex < param.values.length; valueIndex++) {
				let value = param.values[valueIndex]
				let shouldComma = hasStrings(param.values) || param.values.length / (valueIndex + 1) === 2 || param.values.length === 2
				paramContent += `${value}${valueIndex !== param.values.length - 1 ? (shouldComma ? ', ' : ' ') : ''}`
			}

			params += `${param.name}(${paramContent}) `
		}

		line += `@${entity.type} ${params}= ${entity.name}`

		if(entity.description)
			line += ` : "${entity.description}"`

		if(entity.properties || entity.flags || entity.inputs || entity.outputs)
			line += '\n'
		else
			line += ' '
		// OPEN BODY
		line += '['

		// PROPERTIES
		if(entity.properties) {
			line += '\n'
			for(let propIndex in entity.properties) {
				let prop = entity.properties[propIndex]
				line += `\t${prop.name}(${prop.type})`

				if(prop.title)
					line += ` : "${prop.title}"`
				if(prop.deflt !== undefined)
					line += ` : ${numberOrString(prop.deflt)}`
				else if(prop.description !== undefined)
					line += ' :'
				// use !== unefined because sometimes the FGD will use "" instead of a blank space to skip the default
				if(prop.description !== undefined)
					line += ` : "${prop.description}"`

				// CHOICES
				if(prop.choices) {
					line += ' =\n\t['
					for(let choiceIndex in prop.choices) {
						let choice = prop.choices[choiceIndex]
						line += `\n\t\t${numberOrString(choiceIndex)} : "${choice}"`
					}
					line += '\n\t]'
				}
				line += '\n'
			}
		}
		// SPAWNFLAGS
		if(entity.flags) {
			line += '\n\tspawnflags(flags) =\n\t['

			for(let flagIndex in entity.flags) {
				let flag = entity.flags[flagIndex]
				line += `\n\t\t${flag.value} : "${flag.title}" : ${flag.enabled ? 1 : 0}`
			}

			line += '\n\t]\n'
		}

		// INPUTS
		if(entity.inputs) {
			for(let inputIndex in entity.inputs) {
				let input = entity.inputs[inputIndex]
				line += `\n\tinput ${input.name}(${input.type})`
				if(input.description !== undefined)
					line += ` : "${input.description}"`
			}

			line += '\n'
		}
		// OUTPUTS
		if(entity.outputs) {
			for(let outputIndex in entity.outputs) {
				let output = entity.outputs[outputIndex]
				line += `\n\toutput ${output.name}(${output.type})`
				if(output.description !== undefined)
					line += ` : "${output.description}"`
			}

			line += '\n'
		}

		line += ']'

		outFGD += `${line}\n\n`
	}

	return outFGD
}
