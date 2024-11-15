import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";

import { calender } from "./router/calender";
import { router } from "./trpc";
import { createContext } from "./context";
import { tags } from "./router/tags";
import { category } from "./router/category";

const app = express();

export const appRouter = router({
  calender: calender,
  tags: tags,
  category: category,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/", (req, res) => {
  res.send("Server is working fine 👍 👍 👍 ");
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 🚀 🚀 Server listening on port ${port}`);
});

export type AppRouter = typeof appRouter;
