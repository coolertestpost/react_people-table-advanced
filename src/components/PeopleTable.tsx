import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Person } from '../types';

type Props = {
  peopleToDisplay: Person[];
};

export const PeopleTable: React.FC<Props> = ({ peopleToDisplay: people }) => {
  const [searchParams] = useSearchParams();

  const checkForSortMethod = (sortingBy: string) => {
    const sortMethod = searchParams.get('sort');

    if (sortMethod !== sortingBy) {
      return 'fa-sort';
    }

    if (searchParams.has('order') && sortMethod === sortingBy) {
      return 'fa-sort-down';
    }

    if (sortMethod === sortingBy) {
      return 'fa-sort-up';
    }

    return '';
  };

  const checkForSortDescending = (sortingBy: string) => {
    const params = new URLSearchParams(searchParams);

    const sortMethod = params.get('sort');

    if (sortMethod !== sortingBy) {
      params.delete('sort');
      params.delete('order');
    }

    if (params.has('order') && sortMethod === sortingBy) {
      params.delete('sort');
      params.delete('order');
    }

    if (sortMethod === sortingBy && !params.has('order')) {
      params.set('order', 'desc');
    } else {
      params.set('sort', sortingBy);
    }

    if (params.has('order') && !params.has('sort')) {
      params.delete('order');
    }

    if (params.toString()) {
      return `?${params.toString()}`;
    }

    return params.toString();
  };

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Name
              <a href={`#/people${checkForSortDescending('name')}`}>
                <span className="icon">
                  <i className={`fas ${checkForSortMethod('name')}`} />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Sex
              <a href={`#/people${checkForSortDescending('sex')}`}>
                <span className="icon">
                  <i className={`fas ${checkForSortMethod('sex')}`} />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Born
              <a href={`#/people${checkForSortDescending('born')}`}>
                <span className="icon">
                  <i className={`fas ${checkForSortMethod('born')}`} />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Died
              <a href={`#/people${checkForSortDescending('died')}`}>
                <span className="icon">
                  <i className={`fas ${checkForSortMethod('died')}`} />
                </span>
              </a>
            </span>
          </th>

          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {[...people.slice(0, people.length).sort((person1, person2): number => {
          if (searchParams.has('order')) {
            switch (searchParams.get('sort')) {
              case 'name':
                return person2.name.localeCompare(person1.name);

              case 'sex':
                return person2.sex.localeCompare(person1.sex);

              case 'born':
                return person2.born - person1.born;

              case 'died':
                return person2.died - person1.died;

              default:
                return 0;
            }
          }

          switch (searchParams.get('sort')) {
            case 'name':
              return person1.name.localeCompare(person2.name);

            case 'sex':
              return person1.sex.localeCompare(person2.sex);

            case 'born':
              return person1.born - person2.born;

            case 'died':
              return person1.died - person2.died;

            default:
              return 0;
          }
        })].map(person => (
          <tr data-cy="person" key={person.slug}>
            <td>
              <Link
                to={{
                  pathname: `/people/${person.slug}`,
                  search: searchParams.toString(),
                }}
                className={person.sex === 'f' ? 'has-text-danger' : ''}
              >
                {person.name}
              </Link>
            </td>
            <td>{person.sex}</td>
            <td>{person.born}</td>
            <td>{person.died}</td>
            <td
              className={person.sex === 'f' ? 'has-text-danger' : ''}
            >
              {person.motherName ? person.motherName : '-'}
            </td>
            <td>
              {/* eslint-disable-next-line no-nested-ternary */}
              {person.fatherName ? (
                person.father?.slug ? (
                  <Link
                    to={{
                      pathname: `/people/${person.father.slug}`,
                      search: searchParams.toString(),
                    }}
                  >
                    {person.fatherName}
                  </Link>
                ) : person.fatherName
              ) : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
