
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Send, Loader2, Paperclip, X } from 'lucide-react';

interface PromptInputProps {
  onSubmit?: (value: string, files?: File[]) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  autoFocus?: boolean;
  showCharCount?: boolean;
  allowFiles?: boolean;
  acceptedFileTypes?: string;
  maxFiles?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(
  (
    {
      onSubmit,
      placeholder = 'Enter your prompt...',
      disabled = false,
      loading = false,
      maxLength = 5000,
      minRows = 1,
      maxRows = 10,
      autoFocus = false,
      showCharCount = false,
      allowFiles = false,
      acceptedFileTypes = 'image/*,.pdf,.doc,.docx',
      maxFiles = 5,
      className = '',
      value: controlledValue,
      onChange: controlledOnChange,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [rows, setRows] = useState(minRows);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(textareaRef.current);
        } else {
          ref.current = textareaRef.current;
        }
      }
    }, [ref]);

    const calculateRows = (text: string) => {
      const lineCount = text.split('\n').length;
      return Math.min(Math.max(lineCount, minRows), maxRows);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      if (isControlled) {
        controlledOnChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }
      
      setRows(calculateRows(newValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleSubmit = async () => {
      if (!value.trim() || disabled || loading || isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      
      try {
        await onSubmit?.(value, files.length > 0 ? files : undefined);
        
        if (!isControlled) {
          setInternalValue('');
        }
        setFiles([]);
        setRows(minRows);
        textareaRef.current?.focus();
      } catch (error) {
        console.error('Error submitting prompt:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      
      if (files.length + selectedFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files`);
        return;
      }

      setFiles(prev => [...prev, ...selectedFiles].slice(0, maxFiles));
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const isDisabled = disabled || loading || isSubmitting;
    const canSubmit = value.trim().length > 0 && !isDisabled;

    return (
      <div className={`w-full ${className}`}>
        <div className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md text-sm"
                >
                  <Paperclip className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-700 max-w-[150px] truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={isDisabled}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 p-3">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={rows}
              disabled={isDisabled}
              autoFocus={autoFocus}
              className="flex-1 resize-none bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: `${minRows * 1.5}rem`,
                maxHeight: `${maxRows * 1.5}rem`,
              }}
            />

            <div className="flex items-center gap-2 pb-0.5">
              {allowFiles && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedFileTypes}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isDisabled}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDisabled || files.length >= maxFiles}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Attach files"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="relative p-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 group"
                aria-label="Send message"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>

          {showCharCount && maxLength && (
            <div className="px-3 pb-2 text-xs text-gray-500 text-right">
              {value.length} / {maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);
PromptInput.displayName = 'PromptInput';

export default PromptInput;