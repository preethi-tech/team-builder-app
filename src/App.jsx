import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard, CheckSquare, Users, MessageSquare,
  BarChart3, Settings, Bell, Search, Plus, X,
  Calendar, AlertCircle, LogOut, ChevronRight, Activity
} from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import { useAuth } from './contexts/AuthContext'
import { useProjects } from './contexts/ProjectContext'
import { useTasks } from './contexts/TaskContext'
import { useNotifications } from './contexts/NotificationContext'
import { sanitize, validateRequired, validateMaxLength } from './lib/sanitize'
import { CardLoader } from './components/LoadingSpinner'

// ─── Task Creation Modal ─────────────────────────────────────────────────────
function TaskModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', status: 'todo' })
  const [errors, setErrors] = useState({})
  const firstInputRef = useRef(null)

  useEffect(() => { firstInputRef.current?.focus() }, [])

  // Trap focus inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  const validate = () => {
    const errs = {}
    if (!validateRequired(form.title)) errs.title = 'Title is required'
    if (!validateMaxLength(form.title, 200)) errs.title = 'Title must be under 200 characters'
    if (!validateRequired(form.dueDate)) errs.dueDate = 'Due date is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({
      title: sanitize(form.title.trim()),
      description: sanitize(form.description.trim()),
      priority: form.priority,
      dueDate: form.dueDate,
      status: form.status,
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-background rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-lg font-semibold">Create New Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div>
            <label htmlFor="task-title" className="text-sm font-medium block mb-1">
              Title <span aria-hidden="true" className="text-destructive">*</span>
            </label>
            <input
              id="task-title"
              ref={firstInputRef}
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Design login page"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.title && <p id="title-error" role="alert" className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="task-desc" className="text-sm font-medium block mb-1">Description</label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe what needs to be done..."
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="text-sm font-medium block mb-1">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-due" className="text-sm font-medium block mb-1">
                Due Date <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                aria-required="true"
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? 'due-error' : undefined}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.dueDate && <p id="due-error" role="alert" className="text-xs text-destructive mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Project Creation Modal ───────────────────────────────────────────────────
function ProjectModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})
  const firstInputRef = useRef(null)

  useEffect(() => { firstInputRef.current?.focus() }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!validateRequired(form.name)) errs.name = 'Project name is required'
    if (!validateMaxLength(form.name, 100)) errs.name = 'Name must be under 100 characters'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ name: sanitize(form.name.trim()), description: sanitize(form.description.trim()) })
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="project-modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="project-modal-title" className="text-lg font-semibold">New Project</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog"><X className="h-5 w-5" /></Button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div>
            <label htmlFor="project-name" className="text-sm font-medium block mb-1">
              Name <span aria-hidden="true" className="text-destructive">*</span>
            </label>
            <input id="project-name" ref={firstInputRef} type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              aria-required="true" aria-invalid={!!errors.name}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.name && <p role="alert" className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="project-desc" className="text-sm font-medium block mb-1">Description</label>
            <textarea id="project-desc" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} maxLength={500}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [taskError, setTaskError] = useState(null)
  const [search, setSearch] = useState('')

  const { user, userData, logout } = useAuth()
  const { projects, currentProject, createProject } = useProjects()
  const { tasks, loading: tasksLoading, createTask, updateTask } = useTasks()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  const STATUS_COLORS = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'review': 'bg-yellow-100 text-yellow-800',
    'done': 'bg-green-100 text-green-800',
  }
  const PRIORITY_COLORS = {
    'critical': 'bg-red-200 text-red-900',
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-orange-100 text-orange-800',
    'low': 'bg-green-100 text-green-800',
  }

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const filteredTasks = tasks.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  )

  // ── Stats derived from real data ──
  const totalTasks = tasks.length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const completed = tasks.filter(t => t.status === 'done').length
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0

  const handleCreateTask = async (data) => {
    try {
      setTaskError(null)
      await createTask(data)
      setShowTaskModal(false)
    } catch (err) {
      setTaskError(err.message)
    }
  }

  const handleCreateProject = async (data) => {
    try {
      await createProject(data)
      setShowProjectModal(false)
    } catch (err) {
      console.error('Project creation error:', err)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus })
    } catch (err) {
      console.error('Status update error:', err)
    }
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Real-time overview of your team's work</p>
        </div>
        <Button onClick={() => setShowProjectModal(true)}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          New Project
        </Button>
      </div>

      {overdue > 0 && (
        <div role="alert" className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium">{overdue} task{overdue > 1 ? 's are' : ' is'} overdue</span>
          <button className="ml-auto text-sm underline" onClick={() => setActiveTab('tasks')}>View tasks</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl">{totalTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{inProgress}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Active tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{completionRate}% completion rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-red-600">Overdue</CardDescription>
            <CardTitle className={`text-3xl ${overdue > 0 ? 'text-red-600' : ''}`}>{overdue}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Need immediate attention</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest task updates across the team</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? <CardLoader /> : (
              <ul className="space-y-3" aria-label="Recent tasks list">
                {tasks.slice(0, 5).map(task => (
                  <li key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-800'}>
                          {task.status?.replace('-', ' ')}
                        </Badge>
                        <Badge className={PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-800'}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <Avatar className="h-8 w-8 ml-3 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {task.assigneeName ? getInitials(task.assigneeName) : '?'}
                      </AvatarFallback>
                    </Avatar>
                  </li>
                ))}
                {tasks.length === 0 && (
                  <li className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
                    <p>No tasks yet. <button className="underline text-primary" onClick={() => setShowTaskModal(true)}>Create one</button></p>
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Your active projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
                <p>No projects yet. <button className="underline text-primary" onClick={() => setShowProjectModal(true)}>Create one</button></p>
              </div>
            ) : (
              <ul className="space-y-3" aria-label="Projects list">
                {projects.slice(0, 5).map(project => {
                  const projectTasks = tasks.filter(t => t.projectId === project.id)
                  const done = projectTasks.filter(t => t.status === 'done').length
                  const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0
                  return (
                    <li key={project.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{project.name}</p>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${project.name} progress`}>
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{done}/{projectTasks.length} tasks done</p>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // ── Task Board ───────────────────────────────────────────────────────────────
  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Task Board</h2>
          <p className="text-muted-foreground">Kanban view of all team tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="task-search" className="sr-only">Search tasks</label>
          <input
            id="task-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter tasks..."
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48"
          />
          <Button onClick={() => setShowTaskModal(true)}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            New Task
          </Button>
        </div>
      </div>

      {taskError && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />{taskError}
        </div>
      )}

      {tasksLoading ? <CardLoader /> : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['todo', 'in-progress', 'review', 'done'].map(status => {
            const colTasks = filteredTasks.filter(t => t.status === status)
            return (
              <section key={status} className="bg-muted/30 rounded-lg p-4" aria-label={`${status.replace('-', ' ')} column`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold capitalize text-sm">{status.replace('-', ' ')}</h3>
                  <Badge variant="secondary">{colTasks.length}</Badge>
                </div>
                <ul className="space-y-3" aria-label={`${status} tasks`}>
                  {colTasks.map(task => {
                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
                    return (
                      <li key={task.id}>
                        <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300' : ''}`}>
                          <CardContent className="p-4">
                            <p className="font-medium text-sm mb-2">{task.title}</p>
                            {task.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>}
                            <div className="flex items-center gap-1 mb-3 flex-wrap">
                              <Badge className={PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-800'}>
                                {task.priority}
                              </Badge>
                              {isOverdue && <Badge className="bg-red-100 text-red-800">Overdue</Badge>}
                            </div>
                            <div className="flex items-center justify-between">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {task.assigneeName ? getInitials(task.assigneeName) : '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" aria-hidden="true" />
                                <time dateTime={task.dueDate}>{task.dueDate}</time>
                              </div>
                            </div>
                            <div className="mt-3">
                              <label htmlFor={`status-${task.id}`} className="sr-only">Change status</label>
                              <select
                                id={`status-${task.id}`}
                                value={task.status}
                                onChange={e => handleStatusChange(task.id, e.target.value)}
                                className="w-full text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    )
                  })}
                  {colTasks.length === 0 && (
                    <li className="text-center py-6 text-xs text-muted-foreground">No tasks here</li>
                  )}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )

  // ── Team ─────────────────────────────────────────────────────────────────────
  const renderTeam = () => {
    const memberTaskCounts = currentProject?.members?.reduce((acc, uid) => {
      acc[uid] = tasks.filter(t => t.assigneeId === uid).length
      return acc
    }, {}) || {}
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Team & Workflows</h2>
          <p className="text-muted-foreground">Team visibility and task ownership</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Who Is Doing What</CardTitle>
            <CardDescription>Task distribution across the team</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No tasks assigned yet</p>
            ) : (
              <ul className="divide-y" aria-label="Team task distribution">
                {Object.entries(
                  tasks.reduce((acc, t) => {
                    const key = t.assigneeName || t.assigneeId || 'Unassigned'
                    acc[key] = (acc[key] || []).concat(t)
                    return acc
                  }, {})
                ).map(([name, memberTasks]) => (
                  <li key={name} className="py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-xs text-muted-foreground">{memberTasks.length} task{memberTasks.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-12">
                      {memberTasks.map(t => (
                        <Badge key={t.id} className={STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-800'} title={t.title}>
                          {t.title?.length > 30 ? t.title.slice(0, 30) + '…' : t.title}
                        </Badge>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Stages</CardTitle>
            <CardDescription>Standard task lifecycle used across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {['To Do', 'In Progress', 'Review', 'Done'].map((stage, i, arr) => (
                <div key={stage} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm px-3 py-1">{stage}</Badge>
                  {i < arr.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Activity Feed ─────────────────────────────────────────────────────────────
  const renderActivity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Activity Feed</h2>
        <p className="text-muted-foreground">Real-time log of all team actions</p>
      </div>
      <Card>
        <CardContent className="p-6">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No activity yet. Create tasks to see the activity log.</p>
          ) : (
            <ul className="space-y-4" aria-label="Activity feed" aria-live="polite">
              {tasks.slice().reverse().slice(0, 20).map(task => (
                <li key={task.id} className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{task.assigneeName || 'Someone'}</span>
                      {' '}{task.status === 'done' ? 'completed' : 'updated'}
                      {' '}<span className="font-medium">"{task.title}"</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-800'} >
                        {task.status?.replace('-', ' ')}
                      </Badge>
                      <Badge className={PRIORITY_COLORS[task.priority] || 'bg-gray-100 text-gray-800'}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // ── Analytics ────────────────────────────────────────────────────────────────
  const renderAnalytics = () => {
    const byPriority = ['critical', 'high', 'medium', 'low'].map(p => ({
      label: p, count: tasks.filter(t => t.priority === p).length
    }))
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics &amp; Visibility</h2>
          <p className="text-muted-foreground">Live metrics from your Firestore data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Completion Rate</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary" aria-label={`${completionRate} percent`}>{completionRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">{completed} of {totalTasks} tasks done</p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={completionRate} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completionRate}%` }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Overdue Tasks</CardTitle></CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>{overdue}</p>
              <p className="text-sm text-muted-foreground mt-1">{overdue > 0 ? 'Need immediate attention' : 'All tasks on track!'}</p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: totalTasks > 0 ? `${Math.round((overdue / totalTasks) * 100)}%` : '0%' }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active Projects</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{projects.length}</p>
              <p className="text-sm text-muted-foreground mt-1">{totalTasks} total tasks across all projects</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Status</CardTitle>
              <CardDescription>Current workflow distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['todo', 'in-progress', 'review', 'done'].map(status => {
                const count = tasks.filter(t => t.status === status).length
                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status.replace('-', ' ')}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${status} tasks`}>
                      <div className={`h-full rounded-full ${STATUS_COLORS[status]?.split(' ')[0].replace('bg-', 'bg-') || 'bg-primary'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>Work urgency breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {byPriority.map(({ label, count }) => {
                const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{label}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} priority tasks`}>
                      <div className={`h-full rounded-full ${PRIORITY_COLORS[label]?.split(' ')[0] || 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Settings ─────────────────────────────────────────────────────────────────
  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Your account and workspace preferences</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(userData?.displayName || user?.email || 'U')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{userData?.displayName || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">{userData?.role || 'member'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {['Task assignments', 'Task status changes', 'Overdue reminders', 'Project updates'].map(pref => (
            <div key={pref} className="flex items-center justify-between">
              <label htmlFor={`pref-${pref}`} className="text-sm">{pref}</label>
              <input
                id={`pref-${pref}`}
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-primary"
                aria-label={`Enable ${pref} notifications`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={logout}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content - Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>

      {/* Modals */}
      {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} onSubmit={handleCreateTask} />}
      {showProjectModal && <ProjectModal onClose={() => setShowProjectModal(false)} onSubmit={handleCreateProject} />}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 h-screen fixed left-0 top-0 flex flex-col" aria-label="Primary navigation">
          <div className="p-6 border-b">
            <p className="text-xl font-bold flex items-center gap-2" aria-label="TeamSync">
              <span className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center" aria-hidden="true">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </span>
              TeamSync
            </p>
            {currentProject && (
              <p className="text-xs text-muted-foreground mt-2 truncate" title={currentProject.name}>
                {currentProject.name}
              </p>
            )}
          </div>
          <nav className="px-4 space-y-1 py-4 flex-1" aria-label="App sections">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
                {item.id === 'analytics' && overdue > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center" aria-label={`${overdue} overdue`}>
                    {overdue}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex h-16 items-center justify-between px-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <label htmlFor="global-search" className="sr-only">Search tasks</label>
                <input
                  id="global-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => setShowNotifications(v => !v)}
                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                    aria-expanded={showNotifications}
                    aria-haspopup="true"
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" aria-hidden="true">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  {showNotifications && (
                    <div
                      role="dialog"
                      aria-label="Notifications panel"
                      className="absolute right-0 top-12 w-80 bg-background border rounded-xl shadow-lg z-50"
                    >
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-primary underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <ul className="max-h-72 overflow-y-auto divide-y" aria-live="polite">
                        {notifications.length === 0 ? (
                          <li className="p-4 text-sm text-muted-foreground text-center">No notifications</li>
                        ) : notifications.slice(0, 10).map(n => (
                          <li
                            key={n.id}
                            className={`p-4 text-sm cursor-pointer hover:bg-muted/50 ${!n.read ? 'bg-primary/5' : ''}`}
                            onClick={() => markAsRead(n.id)}
                          >
                            <p className="font-medium">{n.title}</p>
                            <p className="text-muted-foreground text-xs mt-0.5">{n.message}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(userData?.displayName || user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main id="main-content" className="flex-1 p-6" tabIndex="-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'tasks' && renderTasks()}
            {activeTab === 'team' && renderTeam()}
            {activeTab === 'activity' && renderActivity()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
