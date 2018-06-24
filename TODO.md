# TODO

## General

[ ] Switch from LowDB to MongoDB
[ ] Better routing using `react-router-config`:
    [ ] Route configuration file
    [ ] Per-page data loading (keeping previous page with a loading indicator)
    [ ] Data loading component
    [ ] Navigation info in a route config instead of a page component
[ ] Separate list component to reuse in a project and a project task lists
[ ] Page component to render a basic layout with a navigation component
[ ] Add global messages for API errors
[ ] Review REST API status codes

## Project List

[ ] Add a way to add/remove projects; when removing show an "are you sure" modal

## Task Info

[ ] Add task info panel to the right of the project task list
    [ ] Change current `text` field to `title`; leave `text` for task text
    [ ] Add `priority` field (low, medium, high)
    [ ] Add `user_id` field; dropdown for awailable users
    [ ] Change `completed` to `state` (new, in progress, done)

## Project Task List

[ ] '/' key press should focus the search field
[ ] Enhance filter: by task state, by priority, by user