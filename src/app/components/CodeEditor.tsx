import React from 'react'
import { Editor } from '@monaco-editor/react'
import { FileItem } from '@/types/index'

interface CodeEditorProps{
    file:FileItem | null,
}

const CodeEditor = ({file}:CodeEditorProps) => {

    if(!file){
        return(
            <div className='h-full flex items-center justify-center  text-gray-300'>
                Select the file to view the content
            </div>
        )
    }
  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      theme="vs-dark"
      value={file.content || ''}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  )
}

export default CodeEditor