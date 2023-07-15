// generic mutation patterns for single/batch create/update/delete
import * as mutations from "../customGraphQL/mutations"
import { LIST_TABLES } from "./_constants"
import gqlFetcher from "./_fetchers"

/**
 * @typedef {'create' | 'update' | 'delete'} ActionType
 * @typedef {typeof LIST_TABLES[number]} TableOption
 */

/**
 * @param {Object} kwargs
 * @param {ActionType} kwargs.action Type of mutation.
 * @param {TableOption} kwargs.table Listed tables have mutations with specially formated responses.
 * @param {Object} kwargs.input Data body for submission.
 * @returns 
 */
export const gqlMutate = ({ action, table, input }) => {
  return gqlFetcher([mutations[`${action}${table}`], { input }])
}

/**
 * @param {Object} kwargs
 * @param {ActionType} kwargs.action Type of mutation.
 * @param {TableOption} kwargs.table Listed tables have mutations with specially formated responses.
 * @param {Object[]} kwargs.inputs Array of submission items.
 * @returns 
 */
export const batchGqlMutate = ({ action, table, inputs }) => {
  let responses = []
  for (let input of inputs) {
    responses.push(gqlFetcher([mutations[`${action}${table}`], { input }]))
  }
  return responses
}

const foo = batchGqlMutate({ action: "create", table:"Product", inputs:[] })
