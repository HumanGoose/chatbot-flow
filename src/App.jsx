import { ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, MiniMap, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {CustomNode} from './components/Node.jsx';
import SidePanel from './components/SidePanel.jsx';
import { useCallback, useState, useEffect, useRef } from 'react';
import NavBar from './components/NavBar.jsx';
import Modal from './components/Modal.jsx';
import Toast from './components/Toast.jsx';

const nodeTypes = {
  custom: CustomNode, 
};

const proOptions = { hideAttribution: true };
const initialNodes = [
  {
    id: 'node-1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Message', 
      content: 'Welcome! How can I help you today?', 
      typeIcon: 'chat', 
      color: '#b1f0c3', 
      nodeIcon: '/src/assets/whatsapp.png' 
    },
  },
  {
    id: 'node-2',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: { 
      label: 'Message', 
      content: 'Great! I can assist with that.', 
      typeIcon: 'chat', 
      color: '#b1f0c3', 
      nodeIcon: '/src/assets/whatsapp.png' 
    },
  },
  {
    id: 'node-3',
    type: 'custom',
    position: { x: 700, y: 100 },
    data: { 
      label: 'Message', 
      content: 'Is there anything else you need?', 
      typeIcon: 'chat', 
      color: '#b1f0c3', 
      nodeIcon: '/src/assets/whatsapp.png' 
    },
  },
];

const initialEdges = [
  {
    id: 'edge-1-2',
    source: 'node-1',
    target: 'node-2',
    type: 'default',
  },
  {
    id: 'edge-2-3',
    source: 'node-2',
    target: 'node-3',
    type: 'default',
  },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [tempContent, setTempContent] = useState('');
  const nextNodeIdRef = useRef(
    initialNodes.length
      ? Math.max(
          ...initialNodes
            .map((n) => parseInt(String(n.id).split('-')[1] || '0', 10))
            .filter((x) => !Number.isNaN(x)),
        ) + 1
      : 1,
  );

  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    message: '',
    variant: 'primary',
    onConfirm: null,
  });

  const [toastState, setToastState] = useState({ open: false, message: '', variant: 'info' });

  // autosave: load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('bitespeed-flow');
      if (raw) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(raw);
        if (Array.isArray(savedNodes) && Array.isArray(savedEdges)) {
          setNodes(savedNodes);
          setEdges(savedEdges);
          // Don't restore nextNodeId - always start fresh
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // autosave: save whenever nodes/edges change
  useEffect(() => {
    try {
      const payload = JSON.stringify({ nodes, edges });
      localStorage.setItem('bitespeed-flow', payload);
    } catch {
      // ignore
    }
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => {
      const hasOutgoingFromSourceHandle = edges.some(
        (edge) => edge.source === params.source && (params.sourceHandle ? edge.sourceHandle === params.sourceHandle : true),
      );

      if (!hasOutgoingFromSourceHandle) {
        setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
      } else {
        setToastState({
          open: true,
          message: 'Cannot add edge: only one outgoing edge allowed from a source handle.',
          variant: 'warning',
        });
      }
    },
    [edges],
  );
  const defaultEdgeOptions = {
    markerEnd: {
      type: 'arrowclosed',
    },
  };

  const addNode = (type, content, typeIcon, color, nodeIcon) => {
    const idNumber = nextNodeIdRef.current++;
    const newNode = {
      id: `node-${idNumber}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${type}`, content: `${content} ${idNumber}` , typeIcon, color, nodeIcon },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdgeId(null);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNode(null);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const confirmDeletion = () => {
      if (selectedNode) {
        setNodes((prev) => prev.filter((n) => n.id !== selectedNode.id));
        setEdges((prev) => prev.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setSelectedNode(null);
        return;
      }
      if (selectedEdgeId) {
        setEdges((prev) => prev.filter((e) => e.id !== selectedEdgeId));
        setSelectedEdgeId(null);
      }
    };

    setModalState({
      open: true,
      title: 'Delete selected item?',
      message: 'This action cannot be undone.',
      variant: 'danger',
      onConfirm: () => {
        confirmDeletion();
        setModalState((s) => ({ ...s, open: false }));
      },
    });
  }, [selectedNode, selectedEdgeId]);

  const handleSave = useCallback(() => {
    const nodesWithNoOutgoing = nodes.filter((n) => !edges.some((e) => e.source === n.id));
    if (nodesWithNoOutgoing.length > 1) {
      setToastState({
        open: true,
        message: 'Save blocked: multiple nodes have no outgoing edges.',
        variant: 'error',
      });
      return;
    }

    const payload = { nodes, edges };
    console.log('Save payload:', payload);
    setToastState({ open: true, message: 'Flow saved successfully.', variant: 'success' });
  }, [nodes, edges]);

  const handleExport = useCallback(() => {
    const data = { nodes, edges, nextNodeId: nextNodeIdRef.current };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bitespeed-flow.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setToastState({ open: true, message: 'Exported flow to JSON.', variant: 'success' });
  }, [nodes, edges]);

  const handleImport = useCallback((data) => {
    if (!data) return;
    const { nodes: incomingNodes, edges: incomingEdges, nextNodeId } = data || {};
    if (Array.isArray(incomingNodes) && Array.isArray(incomingEdges)) {
      setNodes(incomingNodes);
      setEdges(incomingEdges);
      if (typeof nextNodeId === 'number') nextNodeIdRef.current = nextNodeId;
      setToastState({ open: true, message: 'Imported flow from JSON.', variant: 'success' });
    } else {
      setToastState({ open: true, message: 'Invalid import file.', variant: 'error' });
    }
  }, []);

  // Ctrl+S save shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave]);

  useEffect(() => {
    if (selectedNode) {
      setTempContent(selectedNode.data.content || '');
    }
  }, [selectedNode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <NavBar
        canDelete={Boolean(selectedNode || selectedEdgeId)}
        onDelete={handleDeleteSelected}
        onSave={handleSave}
        onImport={handleImport}
        onExport={handleExport}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  selected: selectedNode?.id === node.id,
                },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              defaultEdgeOptions={defaultEdgeOptions}
              proOptions={proOptions}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onEdgeClick={onEdgeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <MiniMap />
              <Background gap={16} color="#eee" />
            </ReactFlow>
          </div>
        </div>
        <SidePanel
          selectedNode={selectedNode}
          tempContent={tempContent}
          setTempContent={setTempContent}
          setNodes={setNodes}
          addNode={addNode}
        />
      </div>
      <Modal
        open={modalState.open}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.onConfirm ? 'Confirm' : 'OK'}
        cancelText={'Cancel'}
        onClose={() => setModalState((s) => ({ ...s, open: false }))}
      />
      <Toast
        open={toastState.open}
        message={toastState.message}
        variant={toastState.variant}
        onClose={() => setToastState((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
