/* eslint-disable max-len */
/* eslint-disable no-console */
import { NavLink, useSearchParams } from 'react-router-dom';

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
  const isActiveClassName = isActive
    ? 'has-background-grey-lighter'
    : '';

  return `navbar-item ${isActiveClassName}`;
};

export const Navbar = () => {
  const [searchParams] = useSearchParams();

  return (
    <nav
      data-cy="nav"
      className="navbar is-fixed-top has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <NavLink
            to="/"
            className={getNavLinkClassName}
          >
            Home
          </NavLink>
          <NavLink
            to={{
              pathname: '/people',
              search: searchParams.toString(),
            }}
            className={getNavLinkClassName}
          >
            People
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
