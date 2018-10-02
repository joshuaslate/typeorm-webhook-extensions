import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();
app.use(bodyParser());

app.use(ctx => {
  ctx.status = 200;
  ctx.body = ctx.request.body;
});

app.listen(8081)

export default app;
