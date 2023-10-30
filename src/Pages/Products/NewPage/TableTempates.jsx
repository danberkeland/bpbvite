import { round } from "lodash"
import { truncate } from "lodash/fp"
import { DateTime } from "luxon"

// Current solution for generating columns dynamically while still allowing for
// customization when needed. This puts yet more emphasis on the yup schema
// as the central configuration space for the page as a whole.

// Body templates will all be defined here, then packaged into an object and
// exported to the main page. Templates can be looked up by the exported
// object's key value. Our strategy is to first look-up by field name,
// then by data type, then finally fall back to a safe 'default' template.

const defaultTemplate = (value) => { 
  return truncate({ length: 30 })(JSON.stringify(value))
}

const stringTemplate = (stringValue) => {
  return truncate({ length: 30 })(stringValue)
}
const numberTemplate = (numberValue) => { 
  return numberValue 
}
const boolTemplate = (boolValue) => {
  return boolValue === true
    ? <i className="pi pi-check-circle" />
    : boolValue === false
      ? <i className="pi pi-times" style={{opacity: ".375"}} />
      : ''
}


const hoursTemplate = (timeFloat) => {
  const hour = Math.floor(Number(timeFloat)) || 0
  const minute = round((Number(timeFloat) - hour) * 60) || 0
  return DateTime.fromObject({ hour, minute }).toFormat('t')
}

const daysAvailableTemplate = (daysAvailableValue) => {
  const value = daysAvailableValue ?? [1,1,1,1,1,1,1]

  return value.every(W => W === 1)
    ? "all"
    : <span>
        {['S','M','T','W','T','F','S'].map((W, idx) => {
          return (
            <span style={{
              //fontWeight: value[idx] ? 'bold' : '',
              opacity: value[idx] ? '' : '.375'
            }}>{W} </span>
          )
        })}
      </span>
}

const bakedWhereTemplate = (bakedWhereValue) => {
  return bakedWhereValue.join(', ')
}


export const bodyTemplates = {
  'default': defaultTemplate,

  'string': stringTemplate,
  'number': numberTemplate,
  'boolean': boolTemplate,

  'readyTime': hoursTemplate,
  'daysAvailable': daysAvailableTemplate,
  'bakedWhere': bakedWhereTemplate

}


// TODOL generate columns here?
// TODO: header templates?