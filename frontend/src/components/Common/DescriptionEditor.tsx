import { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface DescriptionEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function DescriptionEditor({ value, onChange, placeholder = 'Ajouter une description...' }: DescriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const quillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleSave = () => {
    onChange(localValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalValue(value)
    setIsEditing(false)
  }

  // Modules de la toolbar
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
  ]

  // Extraire le texte brut sans HTML pour vérifier si vide
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const isEmpty = !stripHtml(value).trim()

  return (
    <div>
      {isEditing ? (
        <div className="space-y-2">
          {/* Éditeur WYSIWYG */}
          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={localValue}
              onChange={setLocalValue}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              className="description-editor"
            />
          </div>

          {/* Boutons d'actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-secondary-300 text-primary-900 font-semibold rounded hover:bg-secondary-400 transition-colors"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={`min-h-[80px] p-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isEmpty
              ? 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          {isEmpty ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              {placeholder}
            </p>
          ) : (
            <div
              className="prose prose-sm dark:prose-invert max-w-none description-preview"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default DescriptionEditor

