import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { migrate } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

import solutionsRoutes from './routes/solutions.routes.js';
import siteContentRoutes from './routes/site-content.routes.js';
import contactMessagesRoutes from './routes/contact-messages.routes.js';

import faqRoutes from './routes/faq.routes.js';
import sitemapRoutes from './routes/sitemap.routes.js';
const app = express();
const PORT = Number(process.env.PORT) || 3021;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' ? '*' : (process.env.CORS_ORIGIN || '*'),
  credentials: true,
}));
app.use(express.json({ limit: '256kb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use('/api/v1', routes);

app.use('/api/v1', solutionsRoutes);

app.use('/api/v1', siteContentRoutes);

app.use('/api/v1', contactMessagesRoutes);

app.use('/api/v1', faqRoutes);
app.use('/api/v1', sitemapRoutes);
app.use(notFound);
app.use(errorHandler);

migrate()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✔ API listening on http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((e) => {
    console.error('✘ Migration failed:', e);
    process.exit(1);
  });
