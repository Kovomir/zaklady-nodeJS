import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { renderFile } from "ejs";
import { serveStatic } from "@hono/node-server/serve-static";

let todos = [
  {
    id: 1,
    title: "Zajit na pivo",
    done: false,
  },
  {
    id: 2,
    title: "Doplnit skripta",
    done: false,
  },
];

const app = new Hono();
app.use(logger());

app.get("/", async (c) => {
  const rendered = await renderFile("views/index.html", {
    title: "My todo app",
    todos,
  });
  return c.html(rendered);
});

app.get("/todos/:id/toggle", async (c) => {
  const id = Number(c.req.param("id"));
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return c.notFound();

  todo.done = !todo.done;

  const referer = c.req.header("referer");
  if (referer && referer.includes("/todo/")) {
    return c.redirect(`/todo/${id}`);
  }
  return c.redirect("/");
});

app.get("/todos/:id/remove", async (c) => {
  const id = Number(c.req.param("id"));
  todos = todos.filter((todo) => todo.id !== id);

  return c.redirect("/");
});

app.get("/todo/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return c.notFound();

  const rendered = await renderFile("views/todo.html", {
    todo,
  });

  return c.html(rendered);
});

app.post("/todo/:id/change-title", async (c) => {
  const formBody = await c.req.formData();
  const id = Number(formBody.get("id"));
  const title = formBody.get("title");
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return c.notFound();

  todo.title = title;

  const rendered = await renderFile("views/todo.html", {
    todo,
  });

  return c.html(rendered);
});

app.post("/todos", async (c) => {
  const formBody = await c.req.formData();

  todos.push({
    id: todos.length + 1,
    title: formBody.get("title"),
    done: false,
  });

  return c.redirect("/");
});

serve(app, (info) => {
  console.log("App started on http:/localhost:" + info.port);
});
