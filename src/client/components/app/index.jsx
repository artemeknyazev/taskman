// build fontawesome library before using icons
import fontawesome from '@fortawesome/fontawesome'
import {
  faPlus, faEdit, faTrash, faCheck, faTimes, faSearch, faTimesCircle, faDoorOpen,
} from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faPlus, faEdit, faTrash, faCheck, faTimes, faSearch,
  faTimesCircle, faDoorOpen)

import React from 'react'
import { Redirect, Route, Switch }from 'react-router-dom'

import ProjectTaskListPage from 'client/components/project-task-list-page'
import ProjectListPage from 'client/components/project-list-page'
import NotFoundPage from 'client/components/not-found-page'

const Home = () => <div>Home</div>
const Projects = () => <div>Projects</div>
const Tasks = () => <div>Tasks</div>

const App = () => (
  <Switch>
    <Route exact path="/" render={() => (
      <Redirect to="/projects" />
    )} />
    <Route exact path="/projects" render={() => (
      <ProjectListPage />
    )} />
    <Route exact path="/projects/:projectSlug" render={({ match }) => (
      <Redirect to={`/projects/${match.params.projectSlug}/tasks`} />
    )} />
    <Route exact path="/projects/:projectSlug/tasks" render={({ match }) => (
      <ProjectTaskListPage />
    )} />
    <Route exact path="/projects/:projectSlug/tasks/:taskId" render={({ match }) => (
      `Task ${match.params.taskId} for project ${match.params.projectSlug}`
    )} />
    <Route exact path="/404" render={() => (
      <NotFoundPage />
    )} />
    <Route render={() => (
      <Redirect to="/404" />
    )} />
  </Switch>
)
export default App