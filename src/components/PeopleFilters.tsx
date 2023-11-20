import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { getSearchWith } from '../utils/searchHelper';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const checkForSort = () => {
    const sortMethod = searchParams.get('sort');

    if (searchParams.has('sort') && searchParams.has('order')) {
      return `?sort=${sortMethod}&order=${searchParams.get('order')}`;
    }

    if (searchParams.has('sort')) {
      return `?sort=${sortMethod}`;
    }

    return '';
  };

  const checkForSelected = (century: string) => {
    const selectedCenturies = searchParams.getAll('centuries');

    return selectedCenturies.includes(century);
  };

  const toggleCenturies = (century: string) => {
    const params = new URLSearchParams(searchParams);

    if (params.getAll('centuries').includes(century)) {
      const newParams = params.getAll('centuries').filter(item => {
        return item !== century;
      });

      params.delete('centuries');
      newParams.forEach((param) => {
        params.append('centuries', param);
      });
    } else {
      params.append('centuries', century);
    }

    setSearchParams(params);
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <button
          className={classNames('mr-1 button', {
            'is-info': !searchParams.has('sex'),
          })}
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams);

            params.delete('sex');
            setSearchParams(params);
          }}
        >
          All
        </button>
        <button
          className={classNames('mr-1 button', {
            'is-info': searchParams.get('sex') === 'm',
          })}
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            const updatedParams = getSearchWith(params, { sex: 'm' });

            setSearchParams(updatedParams);
          }}
        >
          Male
        </button>
        <button
          className={classNames('button', {
            'is-info': searchParams.get('sex') === 'f',
          })}
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            const updatedParams = getSearchWith(params, { sex: 'f' });

            setSearchParams(updatedParams);
          }}
        >
          Female
        </button>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={searchParams.get('query') || ''}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);

              params.set('query', event.target.value);

              if (event.target.value === '') {
                setSearchParams(getSearchWith(params, {
                  query: null,
                }));

                return;
              }

              setSearchParams(getSearchWith(params, {
                query: event.target.value,
              }));
            }}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            <button
              data-cy="century"
              className={classNames('button mr-1', {
                'is-info': checkForSelected('16'),
              })}
              type="button"
              onClick={(event) => {
                toggleCenturies(event.currentTarget.textContent || '');
              }}
            >
              16
            </button>

            <button
              data-cy="century"
              className={classNames('button mr-1', {
                'is-info': checkForSelected('17'),
              })}
              type="button"
              onClick={(event) => {
                toggleCenturies(event.currentTarget.textContent || '');
              }}
            >
              17
            </button>

            <button
              data-cy="century"
              className={classNames('button mr-1', {
                'is-info': checkForSelected('18'),
              })}
              type="button"
              onClick={(event) => {
                toggleCenturies(event.currentTarget.textContent || '');
              }}
            >
              18
            </button>

            <button
              data-cy="century"
              className={classNames('button mr-1', {
                'is-info': checkForSelected('19'),
              })}
              type="button"
              onClick={(event) => {
                toggleCenturies(event.currentTarget.textContent || '');
              }}
            >
              19
            </button>

            <button
              data-cy="century"
              className={classNames('button mr-1', {
                'is-info': checkForSelected('20'),
              })}
              type="button"
              onClick={(event) => {
                toggleCenturies(event.currentTarget.textContent || '');
              }}
            >
              20
            </button>
          </div>

          <div className="level-right ml-4">
            <button
              data-cy="centuryALL"
              className="button is-success is-outlined"
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams);

                params.delete('centuries');
                // eslint-disable-next-line no-plusplus
                for (let i = 16; i <= 20; i++) {
                  params.append('centuries', `${i}`);
                }

                setSearchParams(params);
              }}
            >
              All
            </button>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <a
          className="button is-link is-outlined is-fullwidth"
          href={`#/people${checkForSort()}`}
        >
          Reset all filters
        </a>
      </div>
    </nav>
  );
};
