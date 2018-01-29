function push(result, key, value) {
    if(result[key])
        result[key].push(value)
    else
        result[key] = [value]
}

function param(result, {name, properties}) {
    let param = {
        name,
        values: []
    }

    for(let valueIndex in properties)
        param.values.push(properties[valueIndex].value)

    push(result, 'parameters', param)
    return result
}

function prop(result, decl) {
    switch(decl.type) {
        case 'Property': {
            // Use "deflt" instead of "default" because the latter is a Javascript keyword.
            const { name, proptype, title, description, deflt } = decl
            const prop = {
                type: proptype,
                name
            }

            if(title)
                prop.title = title.value

            if(description)
                prop.description = description.value

            if(deflt)
                prop.deflt = deflt.value

            if(proptype === 'choices') {
                prop.choices = decl.choices.reduce((result, choice) => {
                    result[choice.key.value] = choice.value.value
                    return result
                }, {})
            }

            push(result, 'properties', prop)
            break
        }

        case 'Connection': {
            const { name, description, args, direction } = decl
            const conn = {
                name,
                description: description && description.value,
                type: args
            }

            switch(direction) {
                case 'input':
                    push(result, 'inputs', conn)
                    break

                case 'output':
                    push(result, 'outputs', conn)
                    break

                default:
                    throw new TypeError(`Unknown connection direction ${direction}`)
            }

            break
        }

        case 'SpawnFlags':
            result.flags = decl.flags.map(({title, value, enabled}) => ({
                title: title.value,
                value: value.value,
                enabled: !!enabled.value
            }))
            break

        default:
            throw new TypeError(`Unknown property type ${decl.type}`)
    }

    return result
}

let includes = []
function decl(result, {type, name, class: cls, description, parameters, body}) {
    if(type === 'Include')
        includes.push(name)

    if(type === 'Declaration') {
        const decl = {
            name,
            type: cls
        }

        if(description)
            decl.description = description.value

        result[name] = body.reduce(prop, parameters.reduce(param, decl))
    }
    return result
}

module.exports = ast => {
    let entObject = ast.body.reduce(decl, {})
    let entities = []

    for(let entIndex in entObject)
        entities.push(entObject[entIndex])
    
    return { includes, entities }
}
