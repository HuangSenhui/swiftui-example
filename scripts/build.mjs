import path from 'path';
import fs from 'fs-extra';
import recursiveReaddirFiles from 'recursive-readdir-files';
import { create } from 'markdown-to-html-cli';

const favicon = 'data:image/png;base64,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',

const options = {
  'github-corners': 'https://github.com/jaywcjlove/swiftui-example.git',
  document: {
    // style,
    link: [
      { rel: 'icon', href: favicon, type: 'image/x-icon' }
      // { rel: 'shortcut icon', href: './favicon.ico' },
      // { rel: 'stylesheet', href: '//unpkg.com/gitalk/dist/gitalk.css' }
    ]
  },
  rewrite: (node) => {
    if (node.type === 'element' && node.tagName === 'body') {
      node.properties = { ...node.properties, id: 'totop' };
      // node.children = [topmenuElm, ...node.children, ...gitalk];
    }
    if (node.type === 'element' && node.properties.href && /.md$/.test(node.properties.href)) {
      if (/readme.md$/.test(node.properties.href.toLocaleLowerCase())) {
        node.properties.href = node.properties.href.toLocaleLowerCase().replace(/readme.md$/, 'index.html');
      } else {
        node.properties.href = node.properties.href.toLocaleLowerCase().replace(/.md$/, '.html');
      }
    }
  }
}

;(async () => {
  await fs.ensureDir('build');
  const pkg = await fs.readJson('package.json');
  const files = await recursiveReaddirFiles(process.cwd(), {
    ignored: /\/(node_modules|\.git|build)/,
    filter: (item) => /(.md|.jpg|.png)$/.test(item.path)
  });
  await Promise.all(files.map(async (item) => {
    const markdown = await fs.readFile(item.path);
    const outputPath = path.join('build', path.relative(process.cwd(), item.path).replace(/README.md$/, 'index.html').replace(/.md$/, '.html'));
    await fs.ensureDir(path.dirname(outputPath));
    if (/.md$/.test(item.path)) {
      let title = markdown.toString().match(/^([\s\S]*?)===/)
      title = title ? title[1].replace(/\n/, '') : '';
      const html = create({
        markdown, ...options,
        document: {
          title: title ? `${title} - SwiftUI by Example v${pkg.version}` : `SwiftUI by Example v${pkg.version}`,
          ...options.document,
          meta: [
            { description: `SwiftUI 示例，技巧和技术集合，帮助我构建应用程序，解决问题以及了解 SwiftUI 的实际工作方式。${title} - SwiftUI by Example v${pkg.version}` },
            { keywords: 'SwiftUI,swift,Example,SwiftUI Example' }
          ]
        }
      });
      await fs.writeFile(outputPath, html);
      console.log(`♻️  create file: \x1b[32;1m ${outputPath} \x1b[0m`);
    } else {
      await fs.copyFile(item.path, outputPath);
      console.log(`🏞  copied file: \x1b[32;1m ${outputPath} \x1b[0m`);
    }
  }));

})();