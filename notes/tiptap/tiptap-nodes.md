#Nodes extensions

If you think of the document as a tree, then nodes are just a type of content in that tree. Examples of nodes are paragraphs, headings, or code blocks. But nodes don’t have to be blocks. They can also be rendered inline with the text, for example for @mentions.


##Nodes
- Blockquote
- BulletList
- CodeBlock
- CodeBlock Lowlight
- Document
- Hard break
- Heading
- Horizontal Rule
- Image
- List Item
- Mention
- Ordered List
- Paragraph
- Table
- Table Cell
- Table Header
- Table Row
- Task Item
- Task List
- Text
- Youtube

***

##Create a new extension
You can build your own extensions from scratch and you know what? It’s the same syntax as for extending existing extension described above.

##Create a node
If you think of the document as a tree, then nodes are just a type of content in that tree. Good examples to learn from are Paragraph, Heading, or CodeBlock.

###Example Code
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

###Code Example
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  name: 'customExtension',

  // Your code goes here.
})

##Publish standalone extensions
If you want to create and publish your own extensions for Tiptap, you can use our CLI tool to bootstrap your project. Simply run npm init tiptap-extension and follow the instructions. The CLI will create a new folder with a pre-configured project for you including a build script running on Rollup.

If you want to test your extension locally, you can run npm link in the project folder and then npm link YOUR_EXTENSION in your project (for example a Vite app).

##Create a custom node view
Node views are the best thing since sliced bread, at least if you are a fan of customization (and bread). With node views you can add interactive nodes to your editor. That can literally be everything. If you can write it in JavaScript, you can use it in your editor.

Node views are amazing to improve the in-editor experience, but can also be used in a read-only instance of Tiptap. They are unrelated to the HTML output by design, so you have full control about the in-editor experience and the output.

##Different types of node views
Depending on what you would like to build, node views work a little bit different and can have their very specific capabilities, but also pitfalls. The main question is: How should your custom node look like?

###Editable text
Yes, node views can have editable text, just like a regular node. That’s simple. The cursor will exactly behave like you would expect it from a regular node. Existing commands work very well with those nodes.

<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view>text</node-view>
  <p>text</p>
</div>

That’s how the TaskItem node works.

###Non-editable text
Nodes can also have text, which is not editable. The cursor can’t jump into those, but you don’t want that anyway.

Tiptap adds a contenteditable="false" to those by default.

<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view contenteditable="false">text</node-view>
  <p>text</p>
</div>

That’s how you could render mentions, which shouldn’t be editable. Users can add or delete them, but not delete single characters.

Statamic uses those for their Bard editor, which renders complex modules inside Tiptap, which can have their own text inputs.

###Mixed content
You can even mix non-editable and editable text. That’s great to build complex things, and still use marks like bold and italic inside the editable content.

BUT, if there are other elements with non-editable text in your node view, the cursor can jump there. You can improve that with manually adding contenteditable="false" to the specific parts of your node view.

<div class="Prosemirror" contenteditable="true">
  <p>text</p>
  <node-view>
    <div contenteditable="false">non-editable text</div>
    <div>editable text</div>
  </node-view>
  <p>text</p>
</div>

###Markup
But what happens if you access the editor content? If you’re working with HTML, you’ll need to tell Tiptap how your node should be serialized.

The editor does not export the rendered JavaScript node, and for a lot of use cases you wouldn’t want that anyway.

Let’s say you have a node view which lets users add a video player and configure the appearance (autoplay, controls, …). You want the interface to do that in the editor, not in the output of the editor. The output of the editor should probably only have the video player.

I know, I know, it’s not that easy. Just keep in mind, that you‘re in full control of the rendering inside the editor and of the output.

What if you store JSON?
That doesn’t apply to JSON. In JSON, everything is stored as an object. There is no need to configure the “translation” to and from JSON.

###Render HTML
Okay, you’ve set up your node with an interactive node view and now you want to control the output. Even if your node view is pretty complex, the rendered HTML can be simple:

renderHTML({ HTMLAttributes }) {
  return ['my-custom-node', mergeAttributes(HTMLAttributes)]
},

// Output: <my-custom-node count="1"></my-custom-node>

Make sure it’s something distinguishable, so it’s easier to restore the content from the HTML. If you just need something generic markup like a <div> consider to add a data-type="my-custom-node".

###Parse HTML
The same applies to restoring the content. You can configure what markup you expect, that can be something completely unrelated to the node view markup. It just needs to contain all the information you want to restore.

Attributes are automagically restored, if you registered them through addAttributes.

// Input: <my-custom-node count="1"></my-custom-node>

parseHTML() {
  return [{
    tag: 'my-custom-node',
  }]
},

Render JavaScript/Vue/React
But what if you want to render your actual JavaScript/Vue/React code? Consider using Tiptap to render your output. Just set the editor to editable: false and no one will notice you’re using an editor to render the content. :-)