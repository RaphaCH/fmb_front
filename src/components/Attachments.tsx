import React, { Dispatch, SetStateAction, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { ModalDetails, StoredFile } from '../models/types';
import { ModalTypes, StorageTypes } from '../models/enums';
import trash from '../assets/icons/trash.png';
import trashPurple from '../assets/icons/trash_purple.png';
import info from '../assets/icons/info.png';
import Collapsible from './Collapsible';
import useLocalStorage from '../utils/useLocalStorage';
import toBase64 from '../utils/toBase64';

type AttachmentsProps = {
  files: FileList | null;
  setFiles: Dispatch<SetStateAction<FileList | null>>;
  deleteFile: (indexToDelete: number) => void;
  openModal: (modalDetails: ModalDetails) => void;
};
type FileItemProps = {
  file: File;
  index: number;
};
const Attachments = ({
  files,
  setFiles,
  deleteFile,
  openModal,
}: AttachmentsProps) => {
  const { setItem } = useLocalStorage();

  const addFiles = async (newFiles: FileList | null) => {
    const existingFiles = await files;
    if (validateSize(newFiles)) {
      const updatedFileList = new DataTransfer();
      if (existingFiles) {
        for (const file of existingFiles) {
          updatedFileList.items.add(file);
        }
      }
      if (newFiles) {
        for (const file of newFiles) {
          updatedFileList.items.add(file);
        }
      }
      (document.getElementById('uploadedFiles') as HTMLInputElement).files =
        updatedFileList.files;
      setFiles(updatedFileList.files);
      const filesToStore = [];
      for (const file of updatedFileList.files) {
        const storageCompatibleFile = {
          name: file.name,
          base64: await toBase64(file),
        };
        filesToStore.push(storageCompatibleFile as StoredFile);
      }
      setItem(StorageTypes.FILES, filesToStore);
    }
  };

  const validateSize = (newFiles: FileList | null) => {
    const existingFiles = files;
    let count = 0;
    let existingFilesSize = 0;
    let newFilesSize = 0;
    if (existingFiles) {
      for (const file of existingFiles) {
        existingFilesSize += Math.floor(file.size / 1000); // Add each file's size in KB
        count++;
      }
    }
    if (newFiles) {
      for (const file of newFiles) {
        newFilesSize += Math.floor(file.size / 1000); // Add each file's size in KB
        count++;
      }
    }
    if (count > 3) {
      openModal({
        message: 'Only three files can be uploaded at one time.',
        type: ModalTypes.ERROR,
      });
      return false;
    } else if (existingFilesSize + newFilesSize > 4000) {
      openModal({
        message: `Your file sizes are too large.\nOnly ${
          4000 - existingFilesSize
        } KB is remaining.`,
        type: ModalTypes.ERROR,
      });
      return false;
    }

    // File size upload limit on the mobility platform is 8MB (8000KB)
    return true;
  };

  const FileItem = ({ file, index }: FileItemProps) => {
    const [isDeleteHovered, setIsDeleteHovered] = useState<boolean>(false);

    return (
      <li className='flex w-fit'>
        <button
          className='icon-btn'
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          onClick={() => deleteFile(index)}
          data-tooltip-id='tooltip-delete'
          data-tooltip-content='Delete'
        >
          {!isDeleteHovered ? (
            <img src={trash} alt='Delete' width={15} />
          ) : (
            <img src={trashPurple} alt='Delete' width={15} />
          )}
        </button>
        <p
          className='mouse-hover'
          onClick={() =>
            openModal({
              message: '',
              type: ModalTypes.PREVIEW_URL,
              url: URL.createObjectURL(file),
            })
          }
          data-tooltip-id='tooltip-preview-file'
          data-tooltip-content='Preview file'
        >
          {file.name}
        </p>
        <Tooltip id='tooltip-delete' />
        <Tooltip id='tooltip-preview-file' />
      </li>
    );
  };

  const AddAttachmentsForm = () => {
    return (
      <div className='attachments text-sm flex'>
        <form>
          <div className='flex'>
            <h1 className='relative'>
              Upload PDF files to be appended to the document (e.g. your rental
              contract or amortization table).
              <span className='info-icon absolute'>
                <img
                  src={info}
                  alt='Info'
                  data-tooltip-id='tooltip-attachment-info'
                  data-tooltip-content='Multiple files can be selected at once. A maximum of three files can be added with a maximum total size of 4MB'
                />
              </span>
            </h1>
          </div>
          <Tooltip id='tooltip-attachment-info' />
          <div
            className='w-fit'
            data-tooltip-id='tooltip-disabled'
            data-tooltip-content={
              'Only three files can be uploaded at one time'
            }
          >
            <label
              htmlFor='uploadedFiles'
              className={
                files?.length > 2
                  ? 'btn btn-disabled btn-primary'
                  : 'btn btn-primary btn-outline'
              }
            >
              Choose files
            </label>
          </div>
          {files?.length > 2 && <Tooltip id='tooltip-disabled' />}
          <input
            type='file'
            id='uploadedFiles'
            multiple
            accept='application/pdf'
            onChange={(e) => addFiles(e.target.files)}
          />
        </form>
        {files && files.length > 0 && (
          <div className='mx-[40px]'>
            <h2 className='subsection-title'>Uploaded files</h2>
            <ul>
              {Array.from(files)?.map((file, index) => (
                <FileItem key={index} file={file} index={index} />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className='container'>
      <Collapsible title='Attachments' child={<AddAttachmentsForm />} />
    </div>
  );
};

export default Attachments;
