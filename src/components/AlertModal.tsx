import React from 'react';
import Modal from 'react-modal';
import { ModalDetails } from '../models/types';
import { ModalTypes } from '../models/enums';
import info from '../assets/icons/info.png';
import successIcon from '../assets/icons/success_purple.png';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: 0,
  },
};

type ModalProps = {
  modalIsOpen: boolean;
  modalDetails: ModalDetails;
  closeModal?: React.MouseEventHandler<HTMLButtonElement>;
  confirmAction?: React.MouseEventHandler<HTMLButtonElement>;
  cancelAction?: React.MouseEventHandler<HTMLButtonElement>;
};
const AlertModal = ({
  modalIsOpen,
  modalDetails,
  closeModal,
  confirmAction,
  cancelAction,
}: ModalProps) => {
  switch (modalDetails.type) {
    case ModalTypes.CONFIRMATION:
      return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Warning'
        >
          <div className='modal-container'>
            <div className='modal-info'>
              <div>
                <img
                  className='padded-icon'
                  src={info}
                  alt='Info'
                  width={30}
                  height={30}
                />
              </div>
              <p className='modal-text'>{modalDetails.message}</p>
            </div>
            <div className='flex'>
              {cancelAction && (
                <button
                  className='btn btn-primary btn-outline'
                  onClick={cancelAction}
                >
                  Cancel
                </button>
              )}
              {confirmAction && (
                <button
                  className='btn btn-primary btn-outline'
                  onClick={confirmAction}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </Modal>
      );
    case ModalTypes.ERROR:
      return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Error'
        >
          <div className='modal-container'>
            <div className='flex flex-col items-center modal-info'>
              <p className='box-title'>Error</p>
              <p className='modal-text'>{modalDetails.message}</p>
            </div>
            <div className='flex'>
              <button
                className='btn btn-primary btn-outline'
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      );
    case ModalTypes.SUCCESS:
      return (
        <Modal isOpen={modalIsOpen} style={customStyles} contentLabel='Success'>
          <div className='modal-container'>
            <div className='flex flex-col items-center modal-info'>
              <p className='modal-text'>{modalDetails.message}</p>
              <img src={successIcon} alt='Success' width={30} height={30} />
            </div>
          </div>
        </Modal>
      );
    case ModalTypes.PREVIEW_URL:
      return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Preview'
        >
          <div className='modal-container'>
            <iframe
              title='File preview'
              src={modalDetails.url}
              height='400px'
            />
          </div>
          <div className='flex'>
            <button
              className='btn btn-primary btn-outline'
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      );
  }
};

export default AlertModal;
