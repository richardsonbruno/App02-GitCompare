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
    };
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
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      reposityInput, repositories, repositoryError, loading,
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

        <CompareList repos={repositories} />
      </Container>
    );
  }
}
