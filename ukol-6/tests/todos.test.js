import test from "ava"
import { migrate } from "drizzle-orm/libsql/migrator"
import { todosTable } from "../src/schema.js"
import { eq } from "drizzle-orm"
import {
  deleteTodoById,
  getAllTodos,
  updateTodo,
  db,
  getTodoById,
} from "../src/db.js"

test.before("run migrations", async () => {
  await migrate(db, { migrationsFolder: "drizzle" })

  await db.insert(todosTable).values({
    id: 1,
    title: "testovaci todo",
    done: false,
  })
})

test.after("cleanup after test", async () => {
  await db.delete(todosTable).where(eq(todosTable.id, 1))
})

test.serial("getTodoById returns id", async (t) => {
  const todo = await getTodoById(1)

  t.is(todo.title, "testovaci todo")
})

test.serial("getAllTodos", async (t) => {
  const todos = await getAllTodos()

  t.is(todos.length, 1)
})

test.serial("updateTodo", async (t) => {
  const todoDto = {
    id: 1,
    title: "updatedTitle",
    priority: "low",
  }

  const updatedTodawait updateTodo(todoDto)

  t.is(updatedTodo.title, "updatedTitle")
  t.is(updatedTodo.priority, "low")
})

test.serial("deleteTodoById", async (t) => {
  await deleteTodoById(1)
  const todos = await getAllTodos()

  t.is(todos.length, 0)
})
