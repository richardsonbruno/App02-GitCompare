import React from 'react';
import PropTypes from 'prop-types';

import { Container, Repository } from './styles';

const CompareList = ({
  repos, handleRemove, handleUpdate, updatedIcon,
}) => (
  <Container>
    {repos.map(repository => (
      <Repository key={repository.id}>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />

          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>

        <ul>
          <li>
            {repository.stargazers_count} <small>stars</small>
          </li>
          <li>
            {repository.forks_count} <small>forks</small>
          </li>
          <li>
            {repository.open_issues_count} <small>issues</small>
          </li>
          <li>
            {repository.lastCommit} <small>last commit</small>
          </li>
        </ul>

        <footer>
          <button onClick={() => handleRemove(repository.id)}>
            <i className="fa fa-remove" />
          </button>

          <button onClick={() => handleUpdate(repository.id)}>
            {updatedIcon ? (
              <i className="fa fa-refresh fa-pulse" />
            ) : (
              <i className="fa fa-refresh" />
            )}
          </button>
        </footer>
      </Repository>
    ))}
  </Container>
);

CompareList.propTypes = {
  repos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      pushed_at: PropTypes.string,
    }),
  ).isRequired,
};

export default CompareList;
