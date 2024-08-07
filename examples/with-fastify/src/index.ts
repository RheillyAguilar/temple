import path from 'path';
import fastify from 'fastify';
import fstatic from '@fastify/static';
import temple from '@ossph/temple/compiler';

const app = fastify({ logger: true });

app.register(fstatic, {
  root: path.join(path.dirname(__dirname), 'public')
})

const compiler = temple({ cwd: __dirname });

app.get('/', async (req, res) => {
  const { document } = await compiler.import('./templates/page.tml');
  const results = document.render({
    title: 'Temple',
    description: 'Edit this file to change the content of the page.',
    start: 0,
    list: [
      'Edit this file',
      'Restyle this page',
      'Create your own component',
      'Star the Temple Repo',
      'Write a blog post about Temple',
      'Fork the respository',
      'Contribute to the project'
    ]
  });
  res.type('text/html');
  res.send(results);
});

app.listen({ port: 3000 }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})