import path from 'path';
import Hapi from '@hapi/hapi';
import inert from '@hapi/inert';
import temple from '@ossph/temple/compiler';

const init = async () => {

  const cwd = path.dirname(__dirname);

  const compiler = temple({ cwd: __dirname });

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    debug: { request: ['error'] },
    routes: {
      files: {
        relativeTo: path.join(cwd, 'public')
      }
    }
  });

  await server.register(inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: async () => {
      const { document } = await compiler.import('./templates/page.tml');
      return document.render({
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
    }
  });

  server.route({
    method: 'GET',
    path: '/{filename}',
    handler: function (request, h) {
      return h.file(request.params.filename);
    }
});

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();