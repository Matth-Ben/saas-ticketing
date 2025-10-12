declare module 'react-quill' {
  import { Component } from 'react'

  export interface QuillOptions {
    modules?: any
    formats?: string[]
    placeholder?: string
    theme?: string
  }

  export default class ReactQuill extends Component<QuillOptions & {
    value: string
    onChange?: (value: string) => void
  }> {}
}

