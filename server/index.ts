
import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
    .use(cors())
    .get('/', () => 'BPNav API Running 🚀')
    .group('/api', app => app
        .get('/militares', () => {
            // TODO: Fetch from DB using Drizzle
            return { message: 'Listagem de militares (To Implementation)' };
        })
        .get('/militares/:id', ({ params: { id } }) => {
            return { message: `Detalhes do militar ${id}` };
        })
        .post('/militares', ({ body }) => {
            return { message: 'Militar criado', data: body };
        })
    )
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
