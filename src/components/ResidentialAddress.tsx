import React, { useEffect, useRef, useState } from 'react';
import Collapsible from './Collapsible';
import Maps from './Maps';
import { ModalTypes } from '../models/enums';
import { APIAddress, Address, ModalDetails } from '../models/types';
import GetCoordinates from '../axios/GetCoordinates';
import location from '../assets/icons/location.png';

type Props = {
  resAddress: Address;
  saveResAddress: (address: Address) => void;
  openModal: (modalDetails: ModalDetails) => void;
};
const ResidentialAddress = ({
  resAddress,
  saveResAddress,
  openModal,
}: Props) => {
  const [addressInfos, setAddressInfos] = useState<undefined | APIAddress>(
    undefined
  );
  const isResAddress = resAddress !== undefined;
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (resAddress) {
      setAddressInfos({
        formatted_address: resAddress.address,
        geometry: { location: resAddress.addressCoordinates },
        inputValueAddress: resAddress.address,
      });
    }
  }, [resAddress]);

  /**
   * Verifies whether or not the address is valid
   * @param address - The unformatted address to be added
   */
  const handleFindAddress = (address: string | undefined) => {
    if (!address) {
      openModal({
        message: 'Unable to find address. Please modify search.',
        type: ModalTypes.ERROR,
      });
    } else {
      GetCoordinates(address).then((res) => {
        if (!res?.formatted_address) {
          setAddressInfos(undefined);
          openModal({
            message: 'Unable to find address. Please modify search.',
            type: ModalTypes.ERROR,
          });
        } else {
          setAddressInfos({ ...res, inputValueAddress: address });
        }
      });
    }
  };

  /**
   * Handles the information entered when submitting a new address
   * and adds the address to the database if the information is valid.
   * @param data - The data (name, type and address) of the new address to be added
   */
  const saveAddress = () => {
    if (addressInfos) {
      saveResAddress({
        addressName: 'Residential address',
        address: addressInfos.formatted_address,
        addressCoordinates: addressInfos.geometry.location,
        distanceFromResAdd: 0,
      });
      openModal({
        message: 'Successfully added your residential address',
        type: ModalTypes.SUCCESS,
      });
    } else {
      openModal({
        message: 'Must validate address before saving',
        type: ModalTypes.ERROR,
      });
    }
  };

  const AddAddressForm = () => {
    return (
      <div className='content-container map-form-container add-address'>
        <div>
          <div className='flex items-end address-row'>
            <div>
              <label className='label'>
                <span className='label-text'>Address:</span>
              </label>
              <input
                className='input input-bordered w-full max-w-xs formInput'
                placeholder='Street, number, city'
                type='text'
                ref={inputRef}
                defaultValue={addressInfos?.inputValueAddress ?? ''}
              />
            </div>
            <button
              type='button'
              className='btn btn-primary btn-outline'
              onClick={() => {
                if (inputRef.current) {
                  handleFindAddress(inputRef.current['value']);
                }
              }}
            >
              Find
            </button>
          </div>
          <button
            className='btn btn-primary save-new-address'
            disabled={
              !addressInfos ||
              (addressInfos &&
                resAddress &&
                addressInfos.formatted_address === resAddress.address)
            }
            onClick={saveAddress}
          >
            Save
          </button>
        </div>
        {addressInfos ? (
          <div className='comLocation add-address-details'>
            <img className='h-20' src={location} alt='location pin' />
            <p className='comAddress text-center'>
              {addressInfos.formatted_address}
            </p>
          </div>
        ) : (
          <p className='add-address-details'>
            Please add a residential address
          </p>
        )}
        <div className='clientMapContainer'>
          {addressInfos && (
            <Maps
              lat={addressInfos?.geometry?.location?.lat}
              lng={addressInfos?.geometry?.location?.lng}
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <div className='container'>
      <Collapsible
        title='Residential address'
        child={<AddAddressForm />}
        isCollapsed={isResAddress}
      />
    </div>
  );
};
export default ResidentialAddress;
