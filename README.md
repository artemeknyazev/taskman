# Taskman

Taskman (from *Task* *Man*ager) is a sample task (currently just todo) management app built using React, Redux and Express

## Installation

```bash
# Clone it
> git clone https://github.com/artemeknyazev/taskman.git
> cd taskman
> npm install

# Generate sample database
> bash db/run.sh

# Build
> npm run build

# Start
> npm start

# Add taskman.localhost to /etc/hosts
# Open http://taskman.localhost:8080 in your browser
```

## Usage

Currently, there are two pages: project list and project task list. Both support keyboard shortcuts: up/down arrows move selection, enter opens project or starts task editing.

On task list one can press Ctrl+Enter to add a task after a selected one, press Delete or Backspace to delete a selected one, and press Ctrl+Arrow Up/Arrow Down to move a task up/down one step. Tasks can also be reordered by dragging using a handle visible when hovering the task item. Escape on a task list clears selection.

Enter on search field selects a first filtered task, Escape blurs the input.
