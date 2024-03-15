import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Collapsible from './Collapsible';
import Maps from './Maps';
import { ModalTypes } from '../models/enums';
import { APIAddress, Address, ModalDetails } from '../models/types';
import GetCoordinates from '../axios/GetCoordinates';
import location from '../assets/icons/location.png';
import getDistance from '../utils/getDistance';
import AddressList from './AddressList';

type Props = {
  addresses: Address[];
  saveAddress: (address: Address) => void;
  openModal: (modalDetails: ModalDetails) => void;
  deleteAddress: (address: Address) => void;
};
type AddressFormData = {
  name: string;
  address: string;
};
const WorkplaceAddress = ({
  addresses,
  saveAddress,
  openModal,
  deleteAddress,
}: Props) => {
  const { register, getValues, handleSubmit, reset } = useForm<AddressFormData>(
    {
      defaultValues: {
        name: '',
        address: '',
      },
    }
  );
  const [addressInfos, setAddressInfos] = useState<undefined | APIAddress>(
    undefined
  );
  const [nameError, setNameError] = useState<boolean>(false);

  /**
   * Verifies whether or not the address is valid
   * @param address - The unformatted address to be added
   */
  const handleFindAddress = (address: string) => {
    GetCoordinates(address).then((res) => {
      if (res?.code === 'ERR_NETWORK') {
        openModal({
          message: 'Unable to connect to network.',
          type: ModalTypes.ERROR,
        });
      } else if (!res?.formatted_address) {
        setAddressInfos(undefined);
        openModal({
          message: 'Unable to find address. Please modify search.',
          type: ModalTypes.ERROR,
        });
      } else {
        setAddressInfos({ ...res, inputValueAddress: address });
      }
    });
  };

  const handleSubmitData = async (data: AddressFormData) => {
    data.name = data.name.trim();
    if (!validateName(data.name)) {
      setNameError(true);
    } else if (addressInfos) {
      const newAddress: Address = {
        addressName: data.name,
        address: addressInfos.formatted_address,
        addressCoordinates: addressInfos.geometry.location,
        distanceFromResAdd: Number(
          getDistance(
            addressInfos.geometry.location,
            addresses[0].addressCoordinates
          )
        ),
      };
      saveAddress(newAddress);
      reset();
      setAddressInfos(undefined);

      openModal({
        message: `Successfully added '${data.name}'`,
        type: ModalTypes.SUCCESS,
      });
    } else {
      openModal({
        message:
          'Must validate address before adding a new residential location',
        type: ModalTypes.ERROR,
      });
    }
  };

  /**
   * Validates the value in an input field
   * @param value - The input field string value to be validated
   */
  const validateName = (value: string) => {
    if (
      addresses.some(
        (add: Address) => add.addressName.toLowerCase() === value.toLowerCase()
      )
    ) {
      return false;
    }
    return true;
  };

  const AddAddressForm = () => {
    return (
      <div>
        <div className='content-container map-form-container add-address'>
          <div className='flex flex-col '>
            {addresses.length < 1 && (
              <p className='text-xs error-message'>
                A residential address must be added before additional workplace
                addresses.
              </p>
            )}
            <p className='text-xs'>A maximum of ten addresses can be added.</p>
            <form onSubmit={handleSubmit(handleSubmitData)}>
              <label className='label'>
                <span className='label-text'>Workplace name:</span>
              </label>
              <input
                placeholder='Enter name'
                maxLength={19}
                className={
                  addresses.length < 1 || addresses.length > 10
                    ? 'input input-bordered w-full max-w-xs form-input disabled-input-field'
                    : 'input input-bordered w-full max-w-xs form-input'
                }
                {...register('name', {
                  onChange: () => {
                    setNameError(false);
                  },
                })}
                required
                autoComplete='off'
              />
              {nameError && (
                <p className='error-message'>
                  This name has already been used. Please choose a unique one.
                </p>
              )}

              <div
                className={
                  nameError
                    ? 'flex items-end address-row'
                    : 'flex items-end address-row pt-[20px]'
                }
              >
                <div>
                  <label className='label'>
                    <span className='label-text'>Address:</span>
                  </label>
                  <input
                    className={
                      addresses.length < 1 || addresses.length > 10
                        ? 'input input-bordered w-full max-w-xs form-input disabled-input-field'
                        : 'input input-bordered w-full max-w-xs form-input'
                    }
                    placeholder='Street, number, city'
                    {...register('address')}
                    required
                    autoComplete='off'
                  />
                </div>
                <button
                  type='button'
                  className={
                    addresses.length < 1 || addresses.length > 10
                      ? 'btn btn-primary'
                      : 'btn btn-primary btn-outline'
                  }
                  disabled={addresses.length < 1 || addresses.length > 10}
                  onClick={() => {
                    const input = getValues('address');
                    handleFindAddress(input);
                  }}
                >
                  Find
                </button>
              </div>
              <button
                className='btn btn-primary save-new-address'
                disabled={!addressInfos}
              >
                Save
              </button>
            </form>
          </div>
          {addressInfos && (
            <div className='location-details add-address-details'>
              <img className='h-20' src={location} alt='location pin' />
              <p className='text-secondary text-center'>
                {addressInfos.formatted_address}
              </p>
            </div>
          )}
          <div className='map-container'>
            {addressInfos && (
              <Maps
                lat={addressInfos?.geometry?.location.lat}
                lng={addressInfos?.geometry?.location.lng}
              />
            )}
          </div>
        </div>
        <AddressList
          addresses={addresses}
          deleteAddress={(address) => deleteAddress(address)}
        />
      </div>
    );
  };
  return (
    <div className='container'>
      <Collapsible title='Workplace address' child={<AddAddressForm />} />
    </div>
  );
};
export default WorkplaceAddress;
