import React from 'react';

type Props = {
  mainWorkplaceName: string | null;
  distance: number | null;
};
const EligibilityMessage = ({ mainWorkplaceName, distance }: Props) => {
  return (
    <div id='eligibilityMessage'>
      {mainWorkplaceName ? (
        <p>
          Your main work location this month is{' '}
          {mainWorkplaceName !== 'Residential address' ? (
            <span>
              <b>{mainWorkplaceName}</b>, which is <b>{distance} km</b> away
              from your residential address.
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
          Based on your work location, you are{' '}
          <b className='text-green-500'>eligible</b> to receive reimbursement
          for FMB housing costs if all other conditions to benefit from such
          reimbursement are met.
        </p>
      ) : (
        <p>
          Based on your work location, you are{' '}
          <b className='text-red-500'>not eligible</b> to receive reimbursement
          for FMB housing costs.
        </p>
      )}
    </div>
  );
};

export default EligibilityMessage;
