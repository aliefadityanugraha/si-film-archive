import { filmService } from '../services/index.js';

export const seoMiddleware = async (request, reply) => {
  const userAgent = request.headers['user-agent'] || '';
  const isBot = /bot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot/i.test(userAgent);

  if (isBot && request.url.startsWith('/detail/')) {
    const filmId = request.url.split('/').pop();
    
    try {
      const film = await filmService.getById(filmId);
      if (film) {
        const title = `${film.judul} - CineArchive`;
        const description = film.sinopsis || 'Detail arsip film mahasiswa.';
        const image = film.gambar_poster || 'https://cinearchive.id/banner.jpg'; // Example domain
        
        reply.type('text/html').send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}</title>
              <meta name="description" content="${description}">
              <meta property="og:title" content="${title}">
              <meta property="og:description" content="${description}">
              <meta property="og:image" content="${image}">
              <meta name="twitter:card" content="summary_large_image">
            </head>
            <body>
              <h1>${film.judul}</h1>
              <p>${description}</p>
              <img src="${image}" />
            </body>
          </html>
        `);
        return reply;
      }
    } catch (err) {
      // Fallback
    }
  }
};
