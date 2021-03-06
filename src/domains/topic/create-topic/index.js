const { returnFields } = require('../../../helpers/common')
const { omit } = require('lodash')
const relationWithTags = require('./relation-with-tags')
const { incrementUser, updateModerator } = require('../../user')
const factoryTopic = require('./factory')
const { USER } = require('../../../../config/pontuation')
const insertTopic = require('./insert-topic')

const { graphqlErrorHandler } = require('../../../helpers/bugnag')

const createTopic = (data, db) => {
  const tags = data.tag
  const dataToInsert = omit(data, 'tag')
  const topic = factoryTopic(dataToInsert)
  const fields = returnFields([], topic)
  return incrementUser(db, data.uid_author, USER.CREATE_TOPIC)
    .then(() => updateModerator(db, data.uid_author))
    .then(() => insertTopic(db, fields, topic))
    .then(relationWithTags(db, tags))
    .catch(graphqlErrorHandler)
}

module.exports = createTopic
