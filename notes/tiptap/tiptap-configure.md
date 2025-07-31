#Configure the Editor
To configure Tiptap, specify three key elements:

where it should be rendered (element)
which functionalities to enable (extensions)
what the initial document should contain (content)
While this setup works for most cases, you can configure additional options.

##Add your configuration
To configure the editor, pass an object with settings to the Editor class, as shown below:

import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  // bind Tiptap to the `.element`
  element: document.querySelector('.element'),
  // register extensions
  extensions: [Document, Paragraph, Text],
  // set the initial content
  content: '<p>Example Text</p>',
  // place the cursor in the editor after initialization
  autofocus: true,
  // make the text editable (default is true)
  editable: true,
  // prevent loading the default CSS (which isn't much anyway)
  injectCSS: false,
})

##Nodes, markes, and extensions
Most editing features are packaged as nodes, marks, or functionality. Import what you need and pass them as an array to the editor.

Here's the minimal setup with only three extensions:

import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  element: document.querySelector('.element'),
  extensions: [Document, Paragraph, Text],
})

##Configure extensions
Many extensions can be configured with the .configure() method. You can pass an object with specific settings.

For example, to limit the heading levels to 1, 2, and 3, configure the Heading extension as shown below:

import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3],
    }),
  ],
})

Refer to the extension's documentation for available settings.

##A bundle with the most common extensions
We have bundled a few of the most common extensions into the StarterKit. Here's how to use it:

import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit],
})

You can configure all extensions included in the StarterKit by passing an object. To target specific extensions, prefix their configuration with the name of the extension. For example, to limit heading levels to 1, 2, and 3:

import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
  ],
})

##Disable specific starterkit extensions
To exclude certain extensions StarterKit, you can set them to false in the configuration. For example, to disable the Undo/Redo History extension:

import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit.configure({
      history: false,
    }),
  ],
})

When using Tiptap's Collaboration, which comes with its own history extension, you must disable the Undo/Redo History extension included in the StarterKit to avoid conflicts.

##Additional extensions
The StarterKit doesn't include all available extensions. To add more features to your editor, list them in the extensions array. For example, to add the Strike extension:

import StarterKit from '@tiptap/starter-kit'
import Strike from '@tiptap/extension-strike'

new Editor({
  extensions: [StarterKit, Strike],
})