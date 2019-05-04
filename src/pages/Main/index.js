import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';

import Logo from '../../assets/logo.png';
import { Container, Form } from './styles';

import CompareList from '../../components/CompareList';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      repositoryError: false,
      reposityInput: '',
      repositories: [],
      updated: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    this.setState({ loading: false, repositories: await this.getLocalRepositories() });
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { reposityInput, repositories } = this.state;

    try {
      const { data: repository } = await api.get(`/repos/${reposityInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        reposityInput: '',
        repositories: [...repositories, repository],
        repositoryError: false,
      });

      const localRepository = await this.getLocalRepositories();

      await localStorage.setItem(
        '@GitCompare:repositories',
        JSON.stringify([...localRepository, repository]),
      );
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  getLocalRepositories = async () => JSON.parse(await localStorage.getItem('@GitCompare:repositories')) || [];

  handleRemoveRepository = async (id) => {
    const { repositories } = this.state;

    const updatedRepositories = repositories.filter(repository => repository.id !== id);

    this.setState({ repositories: updatedRepositories });

    await localStorage.setItem('@GitCompare:repositories', JSON.stringify(updatedRepositories));
  };

  handleUpdateRepository = async (id) => {
    const { repositories } = this.state;

    const repository = repositories.find(repo => repo.id === id);

    document.getElementById(id).classList.add('fa-pulse');

    try {
      const { data } = await api.get(`/repos/${repository.full_name}`);

      data.lastCommit = moment(data.pushed_at).fromNow();

      this.setState({
        repositoryError: false,
        reposityInput: '',
        repositories: repositories.map(repo => (repo.id === data.id ? data : repo)),
      });

      await localStorage.setItem('@GitCompare:repositories', JSON.stringify(repositories));
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      document.getElementById(id).classList.remove('fa-pulse');
    }
  };

  render() {
    const {
      reposityInput, repositories, repositoryError, loading, updated,
    } = this.state;

    return (
      <Container>
        <img src={Logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={reposityInput}
            onChange={e => this.setState({ reposityInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList
          repos={repositories}
          handleRemove={this.handleRemoveRepository}
          updatedIcon={updated}
          handleUpdate={this.handleUpdateRepository}
        />
      </Container>
    );
  }
}
