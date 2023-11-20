import React from 'react';

import { Loader } from '../Loader';
import { PeopleTable } from '../PeopleTable';
import { LoadingError } from './LoadingError';
import { SearchError } from './SearchError';
import { Person } from '../../types';

type Props = {
  loading: boolean,
  error: boolean,
  noPeopleOnServer: boolean,
  searchError: boolean,
  peopleToDisplay: Person[],
};

export const PeopleTableColumn: React.FC<Props> = ({
  loading,
  error,
  noPeopleOnServer,
  searchError,
  peopleToDisplay,
}) => {
  return (
    <div className="column">
      <div className="box table-container">
        {loading && <Loader />}

        {error && <LoadingError />}

        {noPeopleOnServer && (
          <p data-cy="noPeopleMessage">
            There are no people on the server
          </p>
        )}

        {!loading && <PeopleTable {...{ peopleToDisplay }} />}
        {searchError && <SearchError />}
      </div>
    </div>
  );
};
