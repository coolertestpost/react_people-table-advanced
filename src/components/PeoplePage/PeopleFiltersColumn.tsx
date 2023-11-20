import React from 'react';
import { PeopleFilters } from '../PeopleFilters';

type Props = {
  loading: boolean;
};

export const PeopleFiltersColumn: React.FC<Props> = ({ loading }) => {
  return (
    <div className="column is-7-tablet is-narrow-desktop">
      {!loading && <PeopleFilters />}
    </div>
  );
};
