import { Hono } from "hono";
import { cors } from 'hono/cors';
import { AppContext } from './types';
import { authRoutes } from './routes/auth';
import { ideaRoutes } from './routes/ideas';
import { workRoutes } from './routes/works';

const app = new Hono<AppContext>();

// CORS設定
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ルート設定
app.route('/api/auth', authRoutes);
app.route('/api/ideas', ideaRoutes);
app.route('/api/works', workRoutes);

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'RAIDHack API is running',
    timestamp: new Date().toISOString()
  });
});

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to RAIDHack API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (POST /login, POST /register, GET /me, PUT /profile)',
      ideas: '/api/ideas (GET /, GET /:id, POST /, POST /:id/like)',
      works: '/api/works (GET /, GET /:id, POST /, POST /:id/vote)',
      health: '/health'
    }
  });
});

export default app;
