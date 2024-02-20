import React from 'react';
import { Address } from '../models/types';

type Props = {
  mainWorkplace: Address | null;
  distance: number | null;
};
const EligibilityMessage = ({ mainWorkplace, distance }: Props) => {
  console.log(mainWorkplace, distance);
  return (
    <div id='eligibilityMessage'>
      {mainWorkplace ? (
        <p>
          Your main work location this month is{' '}
          {mainWorkplace.addressName !== 'Residential address' ? (
            <span>
              <b>{mainWorkplace.addressName}</b>, which is <b>{distance} km</b>{' '}
              away from your residential address.
            </span>
          ) : (
            <span>
              your <b>residential address</b>.
            </span>
          )}
        </p>
      ) : (
        <p>You have not worked this month.</p>
      )}
      {distance === 0 || (distance && distance < 10) ? (
        <p>
          You are <b className='text-green-500'>eligible</b> to receive
          reimbursement for FMB housing costs.
        </p>
      ) : (
        <p>
          You are <b className='text-red-500'>not eligible</b> to receive
          reimbursement for FMB housing costs.
        </p>
      )}
    </div>
  );
};

export default EligibilityMessage;
