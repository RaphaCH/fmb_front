import React from 'react';
import { Tooltip } from 'react-tooltip';
import trash from '../assets/icons/trash.png';
import trashPurple from '../assets/icons/trash_purple.png';
import { Address } from '../models/types';

type ListProps = {
  addresses: Address[];
  deleteAddress: (address: Address) => void;
};
type ItemProps = {
  address: Address;
};
const AddressList = ({ addresses, deleteAddress }: ListProps) => {
  const Item = ({ address }: ItemProps): JSX.Element | null => {
    const [isDeleteHovered, setIsDeleteHovered] = React.useState(false);
    const distance = address.distanceFromResAdd;

    return (
      <tr>
        <td>{address.addressName}</td>
        <td>{address.address}</td>
        <td className='text-center'>{distance} km</td>
        <td>
          <div className='cursor-pointer' style={{ width: '50px' }}>
            <>
              <button
                className='icon-btn'
                onMouseEnter={() => setIsDeleteHovered(true)}
                onMouseLeave={() => setIsDeleteHovered(false)}
                onClick={() => deleteAddress(address)}
                data-tooltip-id='tooltip-delete'
                data-tooltip-content='Delete'
              >
                {!isDeleteHovered ? (
                  <img src={trash} alt='Delete' width={20} />
                ) : (
                  <img src={trashPurple} alt='Delete' width={20} />
                )}
              </button>
              <Tooltip id='tooltip-delete' />
            </>
          </div>
        </td>
      </tr>
    );
  };

  if (addresses.length > 1) {
    return (
      <div className='registered-addresses'>
        <div className='overflow-x-auto workplace-addresses-table'>
          <table className='table w-full'>
            <thead>
              <tr>
                <th className='bg-accent name'>Workplace name</th>
                <th className='bg-accent'>Address</th>
                <th className='bg-accent text-center distance'>
                  Distance from residential address
                </th>
                <th className='bg-accent delete'></th>
              </tr>
            </thead>
            <tbody>
              {addresses.slice(1).map((address, index) => (
                <Item key={index} address={address} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};
export default AddressList;
