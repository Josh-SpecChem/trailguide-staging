#Node views with React
Using Vanilla JavaScript can feel complex if you are used to work in React. Good news: You can use regular React components in your node views, too. There is just a little bit you need to know, but let’s go through this one by one.

##Render a React component
Here is what you need to do to render React components inside your editor:

1. Create a node extension
2. Create a React component
3. Pass that component to the provided ReactNodeViewRenderer
4. Register it with addNodeView()
5. Configure Tiptap to use your new node extension

This is how your node extension could look like:

import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from './Component.jsx'

export default Node.create({
  // configuration …

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})

There is a little bit of magic required to make this work. But don’t worry, we provide a wrapper component you can use to get started easily. Don’t forget to add it to your custom React component, like shown below:

<NodeViewWrapper className="react-component"> React Component </NodeViewWrapper>

Got it? Let’s see it in action. Feel free to copy the below example to get started.

index.jsx
"""
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import ReactComponent from './Extension.js'

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ReactComponent,
    ],
    content: `
    <p>
      This is still the text editor you’re used to, but enriched with node views.
    </p>
    <react-component count="0"></react-component>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `,
  })

  return (
    <EditorContent editor={editor} />
  )
}
"""

Component.jsx
"""
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default props => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  return (
    <NodeViewWrapper className="react-component">
      <label>React Component</label>

      <div className="content">
        <button onClick={increase}>
          This button has been clicked {props.node.attrs.count} times.
        </button>
      </div>
    </NodeViewWrapper>
  )
}
"""

Extension.js
"""
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default props => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  return (
    <NodeViewWrapper className="react-component">
      <label>React Component</label>

      <div className="content">
        <button onClick={increase}>
          This button has been clicked {props.node.attrs.count} times.
        </button>
      </div>
    </NodeViewWrapper>
  )
}
"""

That component doesn’t interact with the editor, though. Time to wire it up.

##Access node attributes
The ReactNodeViewRenderer which you use in your node extension, passes a few very helpful props to your custom React component. One of them is the node prop. Let’s say you have added an attribute named count to your node extension (like we did in the above example) you could access it like this:

props.node.attrs.count

##Update node attributes
You can even update node attributes from your node, with the help of the updateAttributes prop passed to your component. Pass an object with updated attributes to the updateAttributes prop:

export default (props) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  // …
}

And yes, all of that is reactive, too. A pretty seamless communication, isn’t it?

Adding a content editable
There is another component called NodeViewContent which helps you adding editable content to your node view. Here is an example:

import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export default () => {
  return (
    <NodeViewWrapper className="react-component">
      <span className="label" contentEditable={false}>
        React Component
      </span>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}

You don’t need to add those className attributes, feel free to remove them or pass other class names. Try it out in the following example:

index.jsx
"""
import './styles.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import ReactComponent from './Extension.js'

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ReactComponent,
    ],
    content: `
    <p>
      This is still the text editor you’re used to, but enriched with node views.
    </p>
    <react-component>
      <p>This is editable. You can create a new component by pressing Mod+Enter.</p>
    </react-component>
    <p>
      Did you see that? That’s a React component. We are really living in the future.
    </p>
    `,
  })

  return (
    <EditorContent editor={editor} />
  )
}
"""

Component.jsx
"""
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

export default () => {
  return (
    <NodeViewWrapper className="react-component">
      <label contentEditable={false}>React Component</label>

      <NodeViewContent className="content is-editable" />
    </NodeViewWrapper>
  )
}
"""

Extension.js
"""
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from './Component.jsx'

export default Node.create({
  name: 'reactComponent',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})
"""

Keep in mind that this content is rendered by Tiptap. That means you need to tell what kind of content is allowed, for example with content: 'inline*' in your node extension (that’s what we use in the above example).

The NodeViewWrapper and NodeViewContent components render a <div> HTML tag (<span> for inline nodes), but you can change that. For example <NodeViewContent as="p"> should render a paragraph. One limitation though: That tag must not change during runtime.

Changing the default content tag for a node view
By default a node view rendered by ReactNodeViewRenderer will always have a wrapping div inside. If you want to change the type of this node, you can the contentDOMElementTag to the ReactNodeViewRenderer options:

// this will turn the div into a header tag
return ReactNodeViewRenderer(Component, { contentDOMElementTag: 'header' })

Changing the wrapping DOM element
To change the wrapping DOM elements tag, you can use the contentDOMElementTag option on the ReactNodeViewRenderer function to change the default tag name.

import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import Component from './Component.jsx'

export default Node.create({
  // configuration …

  addNodeView() {
    return ReactNodeViewRenderer(Component, { contentDOMElementTag: 'main' })
  },
})

##All available props
Here is the full list of what props you can expect:

Prop	Description
editor	The editor instance
node	The current node
decorations	An array of decorations
selected	true when there is a NodeSelection at the current node view
extension	Access to the node extension, for example to get options
getPos()	Get the document position of the current node
updateAttributes()	Update attributes of the current node
deleteNode()	Delete the current node