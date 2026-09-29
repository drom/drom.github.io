#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const marked = require('marked');

const template1 = require('../lib/template1.js');
const { title } = require('process');

const tasks = [
  {src: 'nh34p/index.md', title: 'NH34P'}
];

const main = async () => {
  for (const task of tasks) {
    const src = task.src;
    const dstPath = path.join(path.dirname(src), 'index.html');
    const srcBody = await fs.promises.readFile(src, 'utf-8');
    const htmlContent = marked.parse(srcBody);
    const htmlBody = template1({title: task.title, content: htmlContent});
    await fs.promises.writeFile(dstPath, htmlBody, 'utf-8');
  }
};

main();
