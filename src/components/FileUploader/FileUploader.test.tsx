import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUploader from './FileUploader'

describe('FileUploader', () => {
  describe('File Rendering', () => {
    it('should render the drag-and-drop area', () => {
      const { getByText } = render(<FileUploader />)
      expect(getByText('Drag & drop files here')).toBeInTheDocument()
    })

    it('should change the background color on drag over', () => {
      const { getByText } = render(<FileUploader />)
      const dropZone = getByText('Drag & drop files here').parentElement

      fireEvent.dragOver(dropZone!)
      expect(dropZone).toHaveStyle('background-color: bg-blue-500/20')
    })

    it('should have a select file to upload button', () => {
      const { getByLabelText } = render(<FileUploader />)
      expect(getByLabelText('Select file to upload')).toBeInTheDocument()
    })
  })

  describe('File Acceptance', () => {
    it('should accept valid files on drop', async () => {
      const onFileDrop = jest.fn()
      const { getByText, container } = render(
        <FileUploader onFileDrop={onFileDrop} />,
      )
      const dropArea = getByText('Drag & drop files here')

      const validFile = new File(['hello'], 'hello.jpg', { type: 'image/jpeg' })
      const invalidFile = new File(['bye'], 'bye.txt', { type: 'text/plain' })

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [validFile, invalidFile] },
      })

      await waitFor(() => {
        expect(container.querySelector('ul li')).toHaveTextContent(
          validFile.name,
        )
        expect(container.querySelector('ul li')).not.toHaveTextContent(
          invalidFile.name,
        )
        expect(onFileDrop).toHaveBeenCalledWith([validFile])
      })
    })

    it('should not accept invalid files on drop', async () => {
      const onFileDrop = jest.fn()
      const { getByText, container } = render(
        <FileUploader onFileDrop={onFileDrop} />,
      )
      const dropArea = getByText('Drag & drop files here')

      const invalidFile = new File(['bye'], 'bye.txt', { type: 'text/plain' })

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [invalidFile] },
      })

      await waitFor(() => {
        expect(container.querySelector('ul')).toBeEmptyDOMElement()
        expect(onFileDrop).toHaveBeenCalledWith([])
      })
    })

    it('should accept valid files via button click', async () => {
      const user = userEvent.setup()
      const onFileChange = jest.fn()
      const { getByLabelText, getByText } = render(
        <FileUploader onFileChange={onFileChange} />,
      )

      const validFile = new File(['hello'], 'hello.png', { type: 'image/png' })

      const fileInput = getByLabelText('File input')
      await user.upload(fileInput, validFile)
      expect(onFileChange).toHaveBeenCalledWith([validFile])
      expect(getByText(validFile.name)).toBeInTheDocument()
    })

    it('should not accept invalid files via button click', async () => {
      const user = userEvent.setup()
      const onFileChange = jest.fn()
      const { getByLabelText, container } = render(
        <FileUploader onFileChange={onFileChange} />,
      )

      const invalidFile = new File(['hello'], 'hello.txt', {
        type: 'text/plain',
      })

      const fileInput = getByLabelText('File input')
      await user.upload(fileInput, invalidFile)

      expect(container.querySelector('ul')).toBeEmptyDOMElement()
      expect(onFileChange).toHaveBeenCalledWith([])
    })
  })

  describe('File Limit', () => {
    it('should accept only the specified number of files on drop', async () => {
      const onFileDrop = jest.fn()
      const { getByText } = render(
        <FileUploader onFileDrop={onFileDrop} limit={2} />,
      )
      const dropArea = getByText('Drag & drop files here')

      const file1 = new File(['hello'], 'hello.jpg', { type: 'image/jpeg' })
      const file2 = new File(['world'], 'world.png', { type: 'image/png' })
      const file3 = new File(['foo'], 'foo.jpg', { type: 'image/jpeg' }) // Extra file

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file1, file2, file3] },
      })

      await waitFor(() => {
        expect(onFileDrop).toHaveBeenCalledWith([file1, file2]) // Only first two files are passed
      })
    })

    // ... (Add a similar test for button click with a file limit)
    it('should accept only the specified number of files when selected via button click', async () => {
      const user = userEvent.setup()
      const onFileChange = jest.fn()
      const { getByLabelText, getByText } = render(
        <FileUploader onFileChange={onFileChange} limit={1} />,
      )

      const file1 = new File(['hello'], 'hello.jpg', { type: 'image/jpeg' })
      const file2 = new File(['world'], 'world.png', { type: 'image/png' })

      const fileInput = getByLabelText('File input')
      await user.upload(fileInput, [file1, file2])
      expect(onFileChange).toHaveBeenCalledWith([file1])
      expect(getByText(file1.name)).toBeInTheDocument()
      // expect(getByText('world.png')).not.toBeInTheDocument();
    })
  })
})
