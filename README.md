# Bitespeed Chatbot Flow Builder

A powerful, interactive chatbot flow builder built with React and modern web technologies. Design, visualize, and manage complex chatbot conversation flows with an intuitive interface.


## What I Used
- **React-Flow** - Professional node-based flow editor
- **React** - Modern React with hooks and functional components
- **Vite** - Lightning-fast build tool and dev server

## Try it out on your system

### Prerequisites
- Node.js (version 22.18.0)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/HumanGoose/chatbot-flow.git
cd chatbot-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage Guide

### Creating a Flow
1. **Add Nodes**: Use the side panel to add new nodes
2. **Connect Nodes**: Drag from node handles to create connections
3. **Edit Content**: Click on nodes to edit message content
4. **Position Nodes**: Drag nodes to arrange your flow layout

### Managing Your Flow
- **Save**: Use Ctrl+S or the save button to validate your flow
- **Export**: Download your flow as JSON for backup or sharing
- **Import**: Load previously saved flows from JSON files
- **Delete**: Select nodes/edges and use the delete button

### Flow Validation Rules
- Only one node should have no outgoing connections (exit point)
- All other nodes must have at least one outgoing connection
- Flows with multiple exit points cannot be saved


**Built with ❤️ using React, Vite, and @xyflow/react**
