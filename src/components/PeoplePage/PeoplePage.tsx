/* eslint-disable no-console */
/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PeopleFilters } from '../PeopleFilters';
import { Loader } from '../Loader';
import { PeopleTable } from '../PeopleTable';
import { Person } from '../../types';
import { getPeople } from '../../api';
import { PeoplePageTitle } from './PeoplePageTitle';

const aux = { // is the separated file
  searchParameters: {
    sex: 'sex',
    query: 'query',
    centuries: 'centuries',
  },
};

const { // destructure of the impoted file
  searchParameters: {
    centuries: centuriesPar,
    query: queryPar,
    sex: sexPar,
  },
} = aux;

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [noPeopleOnServer, setNoPeopleOnServer] = useState(false);

  const [searchError, setSearchError] = useState(false);

  const [peopleToDisplay, setPeopleToDisplay] = useState<Person[]>([]);
  const [searchParams] = useSearchParams();

  console.log('rerender');

  function checkForMatchingCriteria(filtredPeople: Person[]) { // use arrow functions
    if (filtredPeople.length === 0) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }
  }

  function filterPeople(peopleToFilter: Person[]) {
    let filtredPeople = peopleToFilter;

    if (searchParams.has(queryPar)) {
      const query = searchParams.get(queryPar)?.toLowerCase() || ''; // typescipt dont defines IF above

      filtredPeople = filtredPeople.filter(person => {
        return person.name.toLowerCase().includes(query)
          || person.fatherName?.toLowerCase().includes(query)
          || person.motherName?.toLowerCase().includes(query);
      });
    }

    checkForMatchingCriteria(filtredPeople);

    if (searchParams.has(sexPar)) {
      filtredPeople = filtredPeople.filter((person) => {
        return person.sex === searchParams.get(sexPar);
      });
    }

    checkForMatchingCriteria(filtredPeople);

    if (searchParams.has(centuriesPar)) {
      const centuries = searchParams.getAll(centuriesPar);

      filtredPeople = filtredPeople.filter(person => {
        return centuries.includes((+person.born.toString().slice(0, 2) + 1).toString());
      });
    }

    checkForMatchingCriteria(filtredPeople);
    setPeopleToDisplay(filtredPeople);
  }

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(response => {
        setPeople(response);
        setPeopleToDisplay(response);
        if (!response.length) {
          setNoPeopleOnServer(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterPeople(people);
    //
  }, [searchParams, people]);

  useEffect(() => {
    setSearchError(false);
  }, []);

  return (
    <>
      <PeoplePageTitle />

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">

          <div className="column is-7-tablet is-narrow-desktop">
            {!loading && <PeopleFilters />}
          </div>

          <div className="column">
            <div className="box table-container">
              {loading && <Loader />}

              {error && <p data-cy="peopleLoadingError">Something went wrong</p>}

              {noPeopleOnServer && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              {searchError && <p>There are no people matching the current search criteria</p>}

              {!loading && <PeopleTable {...{ peopleToDisplay }} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * -> Make components splitting
 */
