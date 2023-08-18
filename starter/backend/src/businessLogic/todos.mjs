import * as uuid from 'uuid'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../dataLayer/todosAccess.mjs'
import { createLogger } from '../utils/logger.mjs'
import { getAttachmentUrl } from '../fileStorage/attachmentUtils.mjs'

const logger = createLogger('TodoAccess')

export const getTodosLogic = async (userId) => {
  return getTodos(userId)
}

export const createTodoLogic = async (userId, todo) => {
  const todoId = uuid.v4()
  logger.info(`Creating todo ${todoId}`)
  const attachmentUrl = getAttachmentUrl(todoId)
  return createTodo({
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl,
    ...todo
  })
}

export const updateTodoLogic = async (
  userId,
  todoId,
  todo
) => {
  return updateTodo(userId, todoId, todo)
}

export const deleteTodoLogic = async (userId, todoId) => {
  return deleteTodo(userId, todoId)
}