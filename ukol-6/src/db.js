import { drizzle } from "drizzle-orm/libsql"
import { todosTable } from "./schema.js"
import { eq } from "drizzle-orm"

export const db = drizzle({
  connection:
    process.env.NODE_ENV === "test"
      ? "file::memory:"
      : "file:db.sqlite",
  logger: process.env.NODE_ENV !== "test",
})

export const getTodoById = async (id) => {
  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get()

  return todo
}

export const deleteTodoById = async (id) => {
  await db.delete(todosTable).where(eq(todosTable.id, id))
}

export const updateTodo = async (todo) => {
  await db
    .update(todosTable)
    .set({
      title: todo.title,
      priority: todo.priority,
    })
    .where(eq(todosTable.id, todo.id))

  return await getTodoById(todo.id)
}

export const getAllTodos = async () => {
  return await db.select().from(todosTable).all()
}
