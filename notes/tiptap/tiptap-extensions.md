##Create a new extension
You can build your own extensions from scratch and you know what? It’s the same syntax as for extending existing extension described above.

##Create a node
If you think of the document as a tree, then nodes are just a type of content in that tree. Good examples to learn from are Paragraph, Heading, or CodeBlock.

import { Node } from '@tiptap/core'

const CustomNode = Node.create({
  name: 'customNode',

  // Your code goes here.
})

Nodes don’t have to be blocks. They can also be rendered inline with the text, for example for @mentions.

##Create a mark
One or multiple marks can be applied to nodes, for example to add inline formatting. Good examples to learn from are Bold, Italic and Highlight.

import { Mark } from '@tiptap/core'

const CustomMark = Mark.create({
  name: 'customMark',

  // Your code goes here.
})

##Create an extension
Extensions add new capabilities to Tiptap and you’ll read the word extension here very often, even for nodes and marks. But there are literal extensions. Those can’t add to the schema (like marks and nodes do), but can add functionality or change the behaviour of the editor.

A good example to learn from is probably TextAlign.

import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  // Your code goes here.
})

##Publish standalone extensions
If you want to create and publish your own extensions for Tiptap, you can use our CLI tool to bootstrap your project. Simply run npm init tiptap-extension and follow the instructions. The CLI will create a new folder with a pre-configured project for you including a build script running on Rollup.

If you want to test your extension locally, you can run npm link in the project folder and then npm link YOUR_EXTENSION in your project (for example a Vite app).