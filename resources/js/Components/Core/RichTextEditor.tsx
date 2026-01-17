import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
    FiBold,
    FiItalic,
    FiUnderline,
    FiList,
    FiCode,
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiLink,
    FiImage,
} from 'react-icons/fi';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('bold') ? 'bg-gray-300' : ''
                }`}
                title="Bold"
            >
                <FiBold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('italic') ? 'bg-gray-300' : ''
                }`}
                title="Italic"
            >
                <FiItalic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('underline') ? 'bg-gray-300' : ''
                }`}
                title="Underline"
            >
                <FiUnderline className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
                }`}
                title="Heading 1"
            >
                <span className="text-sm font-bold">H1</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                }`}
                title="Heading 2"
            >
                <span className="text-sm font-bold">H2</span>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
                }`}
                title="Heading 3"
            >
                <span className="text-sm font-bold">H3</span>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('bulletList') ? 'bg-gray-300' : ''
                }`}
                title="Bullet List"
            >
                <FiList className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('orderedList') ? 'bg-gray-300' : ''
                }`}
                title="Numbered List"
            >
                <span className="text-sm font-bold">1.</span>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
                }`}
                title="Align Left"
            >
                <FiAlignLeft className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
                }`}
                title="Align Center"
            >
                <FiAlignCenter className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
                }`}
                title="Align Right"
            >
                <FiAlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
                type="button"
                onClick={addLink}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('link') ? 'bg-gray-300' : ''
                }`}
                title="Add Link"
            >
                <FiLink className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200"
                title="Add Image"
            >
                <FiImage className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('codeBlock') ? 'bg-gray-300' : ''
                }`}
                title="Code Block"
            >
                <FiCode className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({
    content,
    onChange,
    placeholder = 'Write something...',
    error,
    disabled = false,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
            },
        },
    });

    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={`border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            {error && <p className="text-red-500 text-sm mt-1 px-4 pb-2">{error}</p>}
        </div>
    );
}
