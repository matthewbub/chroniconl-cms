'use client'
import React, { useCallback, useEffect } from 'react'

import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  BoldIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  Link2OffIcon,
  List,
  Strikethrough,
  UnderlineIcon,
} from 'lucide-react'
import { debounce } from '@/utils/debounce'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import hljs from 'highlight.js/lib/core'
import go from 'highlight.js/lib/languages/go'
import 'highlight.js/styles/a11y-dark.css'

// load all highlight.js languages
// import { lowlight } from 'lowlight'
import { common, createLowlight } from 'lowlight'
import { Controller, useForm } from 'react-hook-form'

const lowlight = createLowlight(common)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', js)
hljs.registerLanguage('typescript', ts)
hljs.registerLanguage('xml', html)
hljs.registerLanguage('go', go)

const TipTap = ({
  defaultValue,
  params,
  editable = true,
  className = 'min-h-[600px] w-full min-w-full px-4 py-2 prose dark:prose-invert prose-li:py-1 prose:w-full prose-p:0.5 prose-stone',
}: {
  defaultValue?: string
  params?: {
    slug: string
  }
  editable?: boolean
  className?: string
}) => {
  const { control, setValue } = useForm()

  const editor = useEditor({
    editable: editable,
    editorProps: {
      attributes: {
        class: className,
      },
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        strike: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        hardBreak: false,
        horizontalRule: false,
        listItem: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Strike,
      Image,
      Blockquote,
      BulletList,
      ListItem,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      HardBreak,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      HorizontalRule,
      OrderedList,
    ],
    content: defaultValue || '',
  })

  const debouncedUpdate = useCallback(
    debounce(async (content: string) => {
      await fetch('/api/v0/document', {
        method: 'PUT',
        body: JSON.stringify({
          slug: params?.slug,
          content,
        }),
      })
    }, 500),
    [params?.slug],
  )

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.on('update', ({ editor }: any) => {
      if (!params?.slug) return

      const content = editor.getHTML()
      debouncedUpdate(content)
    })
  }, [editor, debouncedUpdate])

  useEffect(() => {
    if (!editor) return

    const updateSelectValue = () => {
      const { $anchor } = editor.state.selection
      const node = $anchor.node($anchor.depth)
      let value = 'Body (normal)'

      if (node.type.name === 'heading') {
        value = `Heading ${node.attrs.level}`
      } else if (node.type.name === 'blockquote') {
        value = 'Blockquote'
      } else if (node.type.name === 'codeBlock') {
        value = 'Code Block'
      } else if (node.type.name === 'paragraph') {
        value = 'Body (normal)'
      }

      setValue('text', value)
    }

    editor.on('selectionUpdate', updateSelectValue)

    return () => {
      editor.off('selectionUpdate', updateSelectValue)
    }
  }, [editor, setValue])

  const setLink = useCallback(() => {
    if (!editor) {
      return
    }

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      if (!editor) {
        return
      }

      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div>
      {editable && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-accent bg-background pb-2">
          <Controller
            name="text"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onValueChange={(value) => {
                  onChange(value)
                  switch (value) {
                    case 'Heading 1':
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                      break
                    case 'Heading 2':
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                      break
                    case 'Heading 3':
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                      break
                    case 'Heading 4':
                      editor.chain().focus().toggleHeading({ level: 4 }).run()
                      break
                    case 'Heading 5':
                      editor.chain().focus().toggleHeading({ level: 5 }).run()
                      break
                    case 'Heading 6':
                      editor.chain().focus().toggleHeading({ level: 6 }).run()
                      break
                    case 'Code Block':
                      editor.chain().focus().toggleCodeBlock().run()
                      break
                    case 'Blockquote':
                      editor.chain().focus().toggleBlockquote().run()
                      break
                    case 'Body (normal)':
                      editor.chain().focus().clearNodes().run()
                      break
                    case 'Clear Formatting':
                      editor.chain().focus().unsetAllMarks().run()
                      editor.chain().focus().clearNodes().run()
                      break
                    default:
                      break
                  }
                }}
              >
                <SelectTrigger className="flex w-[150px] items-center justify-between">
                  <SelectValue placeholder={'Select text'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Body (normal)">Body (normal)</SelectItem>
                  <SelectSeparator />
                  {[
                    'Heading 1',
                    'Heading 2',
                    'Heading 3',
                    'Heading 4',
                    'Heading 5',
                    'Heading 6',
                  ].map((heading) => (
                    <SelectItem key={heading} value={heading}>
                      {heading}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  {['Blockquote', 'Code Block'].map((block) => (
                    <SelectItem key={block} value={block}>
                      {block}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value="Clear">Clear Formatting</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={
              editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''
            }
          >
            <BoldIcon className="h-5 w-5" />
            <span className="sr-only">Bold</span>
          </Button>
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={
              editor.isActive('italic')
                ? 'bg-accent text-accent-foreground'
                : ''
            }
          >
            <ItalicIcon className="h-5 w-5" />
            <span className="sr-only">Italic</span>
          </Button>
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={
              editor.isActive('underline')
                ? 'bg-accent text-accent-foreground'
                : ''
            }
          >
            <UnderlineIcon className="h-5 w-5" />
            <span className="sr-only">Underline</span>
          </Button>

          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive('strike')
                ? 'bg-accent text-accent-foreground'
                : ''
            }
          >
            <Strikethrough className="h-5 w-5" />
            <span className="sr-only">Strike</span>
          </Button>

          {editor.isActive('link') ? (
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Link2OffIcon className="h-5 w-5" />
              <span className="sr-only">Unset Link</span>
            </Button>
          ) : (
            <Button size={'icon'} variant={'ghost'} onClick={setLink}>
              <Link2Icon className="h-5 w-5" />
              <span className="sr-only">Link</span>
            </Button>
          )}
          <Button
            size={'icon'}
            variant={'ghost'}
            onClick={addImage}
            className={
              editor.isActive('image') ? 'bg-accent text-accent-foreground' : ''
            }
          >
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Image</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size={'icon'}
                variant={'ghost'}
                className={
                  editor.isActive('bulletList')
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }
              >
                <List className="h-5 w-5" />
                <span className="sr-only">Bullet List</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className={
                  editor.isActive('bulletList')
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }
                onSelect={() => editor.chain().focus().toggleBulletList().run()}
              >
                Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  editor.isActive('orderedList')
                    ? 'bg-accent text-accent-foreground'
                    : ''
                }
                onSelect={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
              >
                Ordered List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="mt-1" id="tiptap">
        <EditorContent editor={editor} />
      </div>
      <style jsx>{`
        .prose > ul > li > p {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default TipTap
