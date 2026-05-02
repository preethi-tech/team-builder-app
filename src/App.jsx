import { useState } from 'react'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  Calendar,
  Tag,
  Paperclip
} from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Avatar, AvatarFallback } from './components/ui/avatar'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design new landing page', status: 'todo', priority: 'high', assignee: 'JD', dueDate: '2024-05-10', tags: ['design', 'urgent'] },
    { id: 2, title: 'API integration for user auth', status: 'in-progress', priority: 'high', assignee: 'AS', dueDate: '2024-05-08', tags: ['backend', 'api'] },
    { id: 3, title: 'Write documentation', status: 'in-progress', priority: 'medium', assignee: 'MK', dueDate: '2024-05-15', tags: ['docs'] },
    { id: 4, title: 'Fix navigation bug', status: 'done', priority: 'low', assignee: 'JD', dueDate: '2024-05-05', tags: ['bugfix'] },
    { id: 5, title: 'Review pull requests', status: 'todo', priority: 'medium', assignee: 'AS', dueDate: '2024-05-12', tags: ['review'] },
    { id: 6, title: 'Setup CI/CD pipeline', status: 'review', priority: 'high', assignee: 'MK', dueDate: '2024-05-09', tags: ['devops'] },
  ])

  const [messages, setMessages] = useState([
    { id: 1, user: 'Alice Smith', avatar: 'AS', message: 'Hey team! I just pushed the new auth API changes.', time: '10:30 AM' },
    { id: 2, user: 'John Doe', avatar: 'JD', message: 'Great work! I\'ll review them after lunch.', time: '10:35 AM' },
    { id: 3, user: 'Mike Kim', avatar: 'MK', message: 'The documentation is almost ready, just need to add the API examples.', time: '11:00 AM' },
  ])

  const [teamMembers] = useState([
    { id: 1, name: 'John Doe', role: 'Frontend Lead', avatar: 'JD', status: 'online', tasks: 5 },
    { id: 2, name: 'Alice Smith', role: 'Backend Developer', avatar: 'AS', status: 'online', tasks: 3 },
    { id: 3, name: 'Mike Kim', role: 'Full Stack Developer', avatar: 'MK', status: 'away', tasks: 4 },
    { id: 4, name: 'Sarah Wilson', role: 'Designer', avatar: 'SW', status: 'offline', tasks: 2 },
  ])

  const [workflowTemplates] = useState([
    { id: 1, name: 'Feature Development', stages: ['Backlog', 'Design', 'Development', 'Testing', 'Review', 'Done'] },
    { id: 2, name: 'Bug Fix', stages: ['Reported', 'Triaged', 'In Progress', 'Testing', 'Verified', 'Closed'] },
    { id: 3, name: 'Sprint Planning', stages: ['Planning', 'Assigned', 'In Progress', 'Review', 'Complete'] },
  ])

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'done': 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-orange-100 text-orange-800',
      'low': 'bg-green-100 text-green-800',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl">{tasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">+3 from last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{tasks.filter(t => t.status === 'in-progress').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">2 due this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{tasks.filter(t => t.status === 'done').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">+1 from yesterday</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Team Members</CardDescription>
            <CardTitle className="text-3xl">{teamMembers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{teamMembers.filter(m => m.status === 'online').length} online</div>
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
            <div className="space-y-4">
              {tasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{task.assignee}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Recent messages and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Board</h2>
          <p className="text-muted-foreground">Manage and track your team's tasks</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['todo', 'in-progress', 'review', 'done'].map(status => (
          <div key={status} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold capitalize">{status.replace('-', ' ')}</h3>
              <Badge variant="secondary">{tasks.filter(t => t.status === status).length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="font-medium text-sm mb-2">{task.title}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{task.assignee}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {task.dueDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage your team and track availability</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs text-muted-foreground capitalize">{member.status}</span>
                </div>
                <Badge variant="secondary">{member.tasks} tasks</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Pre-configured workflows for different project types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowTemplates.map(template => (
              <Card key={template.id} className="border-2 hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="font-semibold mb-2">{template.name}</div>
                  <div className="flex flex-wrap gap-1">
                    {template.stages.map((stage, i) => (
                      <React.Fragment key={stage}>
                        <Badge variant="outline" className="text-xs">{stage}</Badge>
                        {i < template.stages.length - 1 && <span className="text-muted-foreground">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Chat</h2>
          <p className="text-muted-foreground">Communicate with your team in real-time</p>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>General Channel</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{teamMembers.length} members</Badge>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm mt-1">{msg.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button>
              <Paperclip className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics & Visibility</h2>
        <p className="text-muted-foreground">Track team performance and project progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">78%</div>
            <div className="text-sm text-muted-foreground mt-2">+5% from last month</div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Task Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">3.2 days</div>
            <div className="text-sm text-muted-foreground mt-2">-0.5 days from last month</div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '65%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">92%</div>
            <div className="text-sm text-muted-foreground mt-2">+8% from last month</div>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sprint Progress</CardTitle>
          <CardDescription>Current sprint: May 1 - May 15, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'done').length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'in-progress').length}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'todo').length}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your workspace preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Workspace Name</label>
              <input
                type="text"
                defaultValue="TeamSync Workspace"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Default Timezone</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>IST</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Workspace Description</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows="3"
              defaultValue="Main workspace for team coordination and project management"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            'Task assignments',
            'Task updates',
            'New messages',
            'Mentions',
            'Deadline reminders',
          ].map(pref => (
            <div key={pref} className="flex items-center justify-between">
              <span className="text-sm">{pref}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 h-screen fixed left-0 top-0">
          <div className="p-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              TeamSync
            </h1>
          </div>
          <nav className="px-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex h-16 items-center justify-between px-8">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search tasks, messages, team members..."
                    className="w-[400px] pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-8">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'tasks' && renderTasks()}
            {activeTab === 'team' && renderTeam()}
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
