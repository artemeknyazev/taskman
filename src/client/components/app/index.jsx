// build fontawesome library before using icons
import fontawesome from '@fortawesome/fontawesome'
import {
  faPlus, faEdit, faTrash, faCheck, faTimes, faSearch, faTimesCircle, faDoorOpen,
} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faPlus, faEdit, faTrash, faCheck, faTimes, faSearch,
  faTimesCircle, faDoorOpen)

import React from 'react'
import { Redirect, Route, Switch }from 'react-router-dom'
import { connect } from 'react-redux'
import * as Root from 'client/reducers'

import ProjectTaskListPage from 'client/components/project-task-list-page'
import ProjectListPage from 'client/components/project-list-page'
import NotFoundPage from 'client/components/not-found-page'

const App = ({ state }) => (
  <Switch>
    <Route exact path="/" render={() => (
      <Redirect to="/projects" />
    )} />
    <Route exact path="/projects" render={() => (
      <ProjectListPage />
    )} />
    <Route exact path="/projects/:projectSlug" render={({ match }) => (
      Root.existsProjectBySlug(match.params.projectSlug, state)
        ? <Redirect to={`/projects/${match.params.projectSlug}/tasks`} />
        : <NotFoundPage />
    )} />
    <Route exact path="/projects/:projectSlug/tasks" render={({ match }) => (
      Root.existsProjectBySlug(match.params.projectSlug, state)
        ? <ProjectTaskListPage />
        : <NotFoundPage />
    )} />
    <Route exact path="/404" render={() => (
      <NotFoundPage />
    )} />
    <Route render={() => (
      <Redirect to="/404" />
    )} />
  </Switch>
)

const mapStateToProps = (state) => ({
  state,
})

export default connect(mapStateToProps)(App)