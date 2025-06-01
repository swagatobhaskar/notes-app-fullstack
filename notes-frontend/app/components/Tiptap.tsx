"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const Tiptap = ({value}) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value
        // content: '<p>Hello World! 🌎️</p>',
    })

    return <EditorContent editor={editor} />
}

export default Tiptap
