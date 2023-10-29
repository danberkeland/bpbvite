import * as yup from 'yup'
import { useListData } from '../../../data/_listData'


export const useProductSchema = ({ editMode }) => {

  const { data:PRD=[] } = useListData({ tableName: "Product", shouldFetch: true })
  const prodNicks = PRD.map(P => P.prodNick)
  const prodNames = PRD.map(P => P.prodName)

  const productSchema = yup.object().shape({
    prodNick: yup.string()
      .matches(/^[a-z]+$/, "must contain only lowercase letters")
      .when("$editMode", {
        is: 'create',
        then: schema => schema.notOneOf(prodNicks, "This id is already used")
      })
      .min(2, "Location ID must have at least 2 characters")
      .max(13, "Location ID must have at most 13 characters")
      .required("Required")
      .default('')
      .meta({ category: 'ID'}),
    squareID: yup.string()
      .default('xxx')
      .meta({ category: 'ID'}),
    qbID: yup.string()
      .default('')
      .meta({ category: 'ID'}),

    isRetail: yup.bool()
      .required()
      .default(false)
      .meta({ category: 'Retail'}),
    retailName: yup.string()
      .default('')
      .meta({ category: 'Retail'}),
    retailDescrip: yup.string()
      .default('')
      .meta({ category: 'Retail'}),
    retailPrice: yup.number()
      .nullable()
      .default(0)
      .meta({ category: 'Retail'}),

    isWhole: yup.bool()
      .required()
      .default('true')
      .meta({ category: 'Wholesale'}),
    prodName: yup.string()      
      .when("$editMode", {
        is: 'create',
        then: schema => schema.notOneOf(prodNames, "Name is already used")
      })
      .required("Required")
      .default('')
      .meta({ category: 'Wholesale'}),
    descrip: yup.string()
      .default('description')
      .meta({ category: 'Wholesale'}),
    wholePrice: yup.number()
      .default(0)
      .meta({ category: 'Wholesale'}),
    defaultInclude: yup.bool()
      .default(false)
      .meta({ category: 'Wholesale'}),

    doughNick: yup.string()
      .default('')
      .meta({ category: 'Specs'}),
    packGroup: yup.string()
      .default('')
      .meta({ category: 'Specs'}),
    packGroupOrder: yup.number().integer()
      .default(0)
      .meta({ category: 'Specs'}),
    packSize: yup.number().integer()
      .default(1)
      .meta({ category: 'Specs'}),
    weight: yup.number()
      .default(0)
      .meta({ category: 'Specs'}),
    
    forBake: yup.string()
      .default('')
      .meta({ category: 'Production'}),
    leadTime: yup.number().integer()
      .meta({ category: 'Production'}),
    daysAvailable: yup.array().of(yup.number().integer())
      .default([1,1,1,1,1,1,1])
      .meta({ category: 'Production'}),
    readyTime: yup.number()
      .required()
      .default(null)
      .meta({ category: 'Production'}),
    bakedWhere: yup.array().of(yup.string().oneOf(['Prado', 'Carlton']))
      .default([['Prado']])
      .meta({ category: 'Production'}),
    batchSize: yup.number().integer()
      .default(1)
      .meta({ category: 'Production'}),
    bakeExtra: yup.number().integer()
      .default(0)
      .meta({ category: 'Production'}),
    
    isEOD: yup.bool()
      .default(false)
      .meta({ category: 'Inventory:EOD'}),
    freezerThaw: yup.bool()
      .default(false)
      .meta({ category: 'Inventory:EOD'}),
    currentStock: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:EOD'}),
    updatedAt: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:EOD' }),
    updateFreezerDate: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:EOD'}),
    whoCountedLast: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:EOD'}),

    sheetMake: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Croix'}),
    freezerCount: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Croix'}),
    freezerClosing: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Croix'}),
    freezerNorth: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Croix'}),
    freezerNorthClosing: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Croix'}),
    freezerNorthFlag: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Croix'}),

    prepreshaped: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Preshape'}),
    preshaped: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Preshape'}),
    updatePreDate: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory:Preshape'}),

    // others
    picURL: yup
      .string()
      .default('')
      .meta({ category: 'Other'}),

    Type: yup
      .string()
      .required()
      .default('Product')
      .meta({ category: 'Other'}),

    guarantee: yup.string(),
    transferStage: yup.string(),

    shapeDay: yup.number().integer(),
    shapeNick: yup.string(),

    bakeDay: yup.number().integer(),
    bakeNick: yup.string(),

    backporchbakerypre: yup.number().integer(),
    backporchbakery: yup.number().integer(),
    bpbextrapre: yup.number().integer(),
    bpbextra: yup.number().integer(),
    bpbssetoutpre: yup.number().integer(),
    bpbssetout: yup.number().integer(),

    createdAt: yup.string()

  }).meta({
    categories: [
      'ID', 
      'Retail', 
      'Wholesale', 
      'Specs',
      'Production', 
      'Inventory:EOD', 
      'Inventory:Croix',
      'Inventory:Preshape',
      'Other',
      'undefined'
    ]
  })

  return productSchema

}