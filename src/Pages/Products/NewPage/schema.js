import * as yup from 'yup'
import { useListData } from '../../../data/_listData'
import { set } from 'lodash'


export const useProductSchema = ({ editMode }) => {

  const { data:PRD=[] } = useListData({ tableName: "Product", shouldFetch: true })
  const prodNicks = PRD.map(P => P.prodNick)
  const prodNames = PRD.map(P => P.prodName)

  const { data:DGH=[] } = useListData({ tableName: "DoughBackup", shouldFetch: !!editMode })
  const doughNicks = DGH.map(D => D.doughName).concat('')

  const hubOptions = ['Prado', 'Carlton']

  const packGroups = [
    { label: "Baked Pastries", value: "baked pastries" },
    { label: "Frozen Pastries", value: "frozen pastries" },
    { label: "Rustic Breads", value: "rustic breads" },
    { label: "Brioche Products", value: "brioche products" },
    { label: "Sandwich Breads", value: "sandwich breads" },
    { label: "Rolls", value: "rolls" },
    { label: "Focaccia", value: "focaccia" },
    { label: "Retail", value: "retail" },
    { label: "Cafe Menu", value: "cafe menu" },
  ]

  const productSchema = yup.object().shape({
    prodNick: yup.string()
      .matches(/^[a-z]+$/, "must contain only lowercase letters")
      .when("$editMode", {
        is: 'create',
        then: schema => schema.notOneOf(prodNicks, "This id is already used")
      })
      .min(2, "ID must have at least 2 characters")
      .max(13, "ID must have at most 13 characters")
      .required("Required")
      .default('')
      .meta({ 
        category: 'ID',
        input: {
          disableWhen: ['update']
        }
      }),
    squareID: yup.string()
      .default('xxx')
      .meta({ 
        category: 'ID',
        input: {
          disableWhen: ['create', 'update'],
        }
      }),
    qbID: yup.string()
      .default('')
      .meta({ 
        category: 'ID',
        input: {
          disableWhen: ['create', 'update'],
        }
      }),

    isRetail: yup.bool()
      .typeError('Unexpected null value')
      .required()
      .default(false)
      .meta({ category: 'Retail'}),
    retailName: yup.string()
      .nullable()
      .default('')
      .meta({ category: 'Retail'}),
    retailDescrip: yup.string()
      .nullable()
      .default('')
      .meta({ category: 'Retail'}),
    retailPrice: yup.number()
      .nullable()
      .default(0)
      .meta({ category: 'Retail'}),

    isWhole: yup.bool()
      .typeError('Unexpected null value')
      .required()
      .default(true)
      .meta({ category: 'Wholesale'}),
    prodName: yup.string()      
      .when("$editMode", {
        is: 'create',
        then: schema => schema.notOneOf(prodNames, "Name is already used")
      })
      .required("Required")
      .min(3, "Must have at least 3 characters")
      .default('')
      .meta({ 
        category: 'Wholesale',
        input: {
          disableWhen: ['update']
        }
      }),
    descrip: yup.string()
      .default('description')
      .meta({ category: 'Wholesale'}),
    wholePrice: yup.number()
      .default(0)
      .meta({ category: 'Wholesale'}),
    defaultInclude: yup.bool()
      .typeError('Unexpected null value')
      .default(false)
      .meta({ category: 'Wholesale'}),

    doughNick: yup.string()
      .oneOf(doughNicks)
      .default('')
      .meta({ 
        category: 'Specs',
        input: {
          name: 'singleSelect',
          props: { options: doughNicks },
        }
      }),
    packGroup: yup.string().oneOf(packGroups.map(item => item.value))
      .default('')
      .meta({ 
        category: 'Specs',
        input: {
          name: 'singleSelect',
          props: { options: packGroups }
        }
      }),
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
      .nullable()
      .meta({ 
        category: 'Production',
      }),
    readyTime: yup.number()
      .required()
      .default(null)
      .meta({ category: 'Production'}),
    bakedWhere: yup.array().of(yup.string().oneOf(hubOptions))
      .default(['Prado'])
      .meta({ 
        category: 'Production',
        input: {
          name: 'multiSelect',
          props: { options: hubOptions },
        }
      }),
    batchSize: yup.number().integer()
      .default(1)
      .meta({ category: 'Production'}),
    bakeExtra: yup.number().integer()
      .default(0)
      .meta({ category: 'Production'}),
    
    isEOD: yup.bool()
      .typeError('Unexpected null value')
      .default(false)
      .meta({ category: 'Inventory.EOD'}),
    freezerThaw: yup.bool()
      .typeError('Unexpected null value')
      .default(false)
      .meta({ category: 'Inventory.EOD'}),
    currentStock: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.EOD'}),
    updateFreezerDate: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.EOD'}),
    updatedAt: yup.string()
      .nullable()
      .default(null)
      .meta({ 
        category: 'Inventory.EOD',
        input: {
          disableWhen: ['create']
        },
      }),
    whoCountedLast: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.EOD'}),

    sheetMake: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Croix'}),
    freezerCount: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Croix'}),
    freezerClosing: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Croix'}),
    freezerNorth: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Croix'}),
    freezerNorthClosing: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Croix'}),
    freezerNorthFlag: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Croix'}),

    prepreshaped: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Preshape'}),
    preshaped: yup.number().integer()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Preshape'}),
    updatePreDate: yup.string()
      .nullable()
      .default(null)
      .meta({ category: 'Inventory.Preshape'}),

    Type: yup.string()
      .required()
      .default('Product')
      .meta({ category: 'Other'}),
    picURL: yup.string()
      .nullable()
      .default('')
      .meta({ category: 'Other'}),
    createdAt: yup.string()
      .nullable()
      .default(null)
      .meta({ 
        category: 'Other',
        input: {
          disableWhen: ['create', 'update']
        },
      }),
    guarantee: yup.string().nullable(),
    transferStage: yup.string().nullable(),

    shapeDay: yup.number().integer().nullable(),
    shapeNick: yup.string().nullable(),

    bakeDay: yup.number().integer().nullable(),
    bakeNick: yup.string().nullable(),

    backporchbakerypre: yup.number().integer().nullable(),
    backporchbakery: yup.number().integer().nullable(),
    bpbextrapre: yup.number().integer().nullable(),
    bpbextra: yup.number().integer().nullable(),
    bpbssetoutpre: yup.number().integer().nullable(),
    bpbssetout: yup.number().integer().nullable(),

  }).meta({
    categories: [
      'ID', 
      'Retail', 
      'Wholesale', 
      'Specs',
      'Production', 
      'Inventory.EOD', 
      'Inventory.Croix',
      'Inventory.Preshape',
      //'Other',
      //'undefined'
    ]
  })

  return productSchema

}

/**
 * Enhances the default validation of formik's validationSchema 
 * integration with yup, allowing us to pass a context object.
 * 
 * This lets us use .when() in our schema, allowing for different
 * validation requirements in create vs. update contexts.
 * 
 * Source: https://www.fullstacklabs.co/blog/how-to-use-yup-context-variables-in-formik-validation#:~:text=The%20validation%20library%20Yup%20allows,instance%20of%20the%20other%20object.
 */
export const validateWithContext = (schema, values, context) => {
  try {
    schema.validateSync(values, {
      abortEarly: false,
      context,
    })
  } catch (error) {
    if (error.name !== "ValidationError") {
      throw error;
    }

    return error.inner.reduce((errors, currentError) => {
      errors = set(errors, currentError.path, currentError.message);
      return errors;
    }, {})
  }

  return {}
}