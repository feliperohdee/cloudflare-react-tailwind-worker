import { Hono } from 'hono';
import { reactRenderer } from '@hono/react-renderer';

import Home from '@/pages/home';
import Layout from '@/layout';

const app = new Hono<{ Bindings: Env }>();

app.use(reactRenderer(Layout));
app.get('/', c => {
	return c.render(<Home />);
});

export default app;
