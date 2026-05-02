# TeamSync - Team Coordination Platform

A modern, comprehensive platform designed to improve team coordination and communication. TeamSync simplifies workflows and provides complete visibility into tasks, team activities, and project progress.

## Features

### 🎯 Dashboard
- **Overview Metrics**: Real-time statistics on total tasks, in-progress items, completed tasks, and team members
- **Recent Tasks**: Quick view of the latest task updates across the team
- **Team Activity**: Live feed of team messages and updates
- **Visual Analytics**: Easy-to-understand progress indicators

### ✅ Task Management
- **Kanban Board**: Drag-and-drop style task organization with four stages (Todo, In Progress, Review, Done)
- **Task Priorities**: High, Medium, and Low priority levels with color-coded badges
- **Assignees**: Clear task ownership with avatar identification
- **Due Dates**: Track deadlines and stay on schedule
- **Tags**: Organize tasks with custom tags for better categorization

### 👥 Team Coordination
- **Team Overview**: View all team members with their roles and current status
- **Availability Tracking**: Real-time online/away/offline status indicators
- **Workload Distribution**: See task counts per team member
- **Workflow Templates**: Pre-configured workflows for different project types:
  - Feature Development
  - Bug Fix
  - Sprint Planning

### 💬 Communication
- **Real-time Chat**: Team messaging with timestamps
- **Channel-based**: Organized communication channels
- **User Avatars**: Easy identification of message senders
- **Attachment Support**: Share files and documents

### 📊 Analytics & Visibility
- **Task Completion Rate**: Track team efficiency over time
- **Average Task Duration**: Monitor how long tasks take to complete
- **Team Productivity**: Overall productivity metrics
- **Sprint Progress**: Visual progress tracking for current sprints
- **Trend Analysis**: Compare performance across different time periods

### ⚙️ Settings
- **Workspace Configuration**: Customize workspace name and description
- **Timezone Settings**: Set default timezone for the team
- **Notification Preferences**: Control which notifications you receive
- **Privacy Controls**: Manage workspace visibility settings

## Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Custom shadcn/ui-inspired components
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, date-fns
- **Routing**: React Router DOM (ready for implementation)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
hack/
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── badge.jsx
│   │       └── avatar.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── postcss.config.js        # PostCSS configuration
```

## Usage

### Navigation
Use the sidebar to navigate between different sections:
- **Dashboard**: Overview of all activities
- **Tasks**: Kanban board for task management
- **Team**: Team members and workflow templates
- **Messages**: Team communication
- **Analytics**: Performance metrics and insights
- **Settings**: Workspace configuration

### Task Management
1. Click on the "Tasks" tab in the sidebar
2. View tasks organized by status columns
3. Each task card shows priority, assignee, and due date
4. Click "New Task" button to create new tasks (UI ready, backend integration needed)

### Team Communication
1. Navigate to the "Messages" tab
2. Type your message in the input field
3. Click "Send" or press Enter to post
4. Attach files using the paperclip icon (UI ready)

### Analytics
1. Visit the "Analytics" tab
2. View key metrics and progress indicators
3. Monitor sprint progress and team performance

## Future Enhancements

- [ ] Backend integration with database
- [ ] User authentication and authorization
- [ ] Real-time updates with WebSocket
- [ ] File upload and storage
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile-responsive design optimization
- [ ] Dark mode toggle
- [ ] Advanced search and filtering
- [ ] Task dependencies and subtasks
- [ ] Time tracking functionality
- [ ] Export reports (PDF, CSV)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

**TeamSync** - Streamline your team's coordination and boost productivity! 🚀
