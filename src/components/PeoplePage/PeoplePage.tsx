import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Person } from '../../types';
import { getPeople } from '../../api';

import { PeoplePageTitle } from './PeoplePageTitle';
import { PeopleFiltersColumn } from './PeopleFiltersColumn';
import { PeopleTableColumn } from './PeopleTableColumn';
import { aux } from './auxObject';

const { // destructure of the impoted file
  searchParameters: {
    centuries: centuriesPar,
    query: queryPar,
    sex: sexPar,
  },
} = aux;

interface CheckTargetObjectHasQueryProps {
  targetObject: Person,
  targetField: keyof Person,
  query: string,
}

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [noPeopleOnServer, setNoPeopleOnServer] = useState(false);

  const [searchError, setSearchError] = useState(false);

  const [peopleToDisplay, setPeopleToDisplay] = useState<Person[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(response => {
        setPeople(response);

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

  useEffect(() => { // filtering people
    if (!people.length) {
      return;
    }

    let filteredPeople = people;

    if (searchParams.has(queryPar)) {
      const query = searchParams.get(queryPar)?.toLowerCase() || '';

      const checkTargetObjectHasQuery = ({
        targetObject,
        targetField,
        query: queryParameter,
      }: CheckTargetObjectHasQueryProps) => {
        return String(targetObject[targetField])
          ?.toLowerCase()
          .includes(queryParameter);
      };

      const filterCallback = (person: Person) => {
        const checkedName = checkTargetObjectHasQuery({
          query,
          targetField: 'name',
          targetObject: person,
        });

        const checkedFatherName = checkTargetObjectHasQuery({
          query,
          targetField: 'fatherName',
          targetObject: person,
        });

        const checkedMotherName = checkTargetObjectHasQuery({
          query,
          targetField: 'motherName',
          targetObject: person,
        });

        return checkedMotherName || checkedFatherName || checkedName;
      };

      filteredPeople = filteredPeople.filter(filterCallback);
    }

    if (searchParams.has(sexPar)) {
      filteredPeople = filteredPeople.filter((person) => {
        const { sex } = person;
        const sexSearchParamValue = searchParams.get(sexPar);

        return sex === sexSearchParamValue;
      });
    }

    if (searchParams.has(centuriesPar)) {
      const centuries = searchParams.getAll(centuriesPar);

      filteredPeople = filteredPeople.filter(person => {
        const personBorn = person.born.toString();
        const firstTwoNumbersOfPersonBornYear = Number(personBorn.slice(0, 2));
        const personBornCentury = firstTwoNumbersOfPersonBornYear + 1;

        return centuries.includes(personBornCentury.toString());
      });
    }

    setSearchError(!filteredPeople.length);
    setPeopleToDisplay(filteredPeople);
  }, [searchParams, people]);

  return (
    <>
      <PeoplePageTitle />

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">

          <PeopleFiltersColumn loading={loading} />

          <PeopleTableColumn
            loading={loading}
            error={error}
            searchError={searchError}
            noPeopleOnServer={noPeopleOnServer}
            {...{ peopleToDisplay }}
          />

        </div>
      </div>
    </>
  );
};
