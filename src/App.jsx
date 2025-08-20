import { ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {CustomNode} from './components/Node.jsx';
import SidePanel from './components/SidePanel.jsx';
import { useCallback, useState, useEffect } from 'react';

const nodeTypes = {
  custom: CustomNode, 
};

const proOptions = { hideAttribution: true };
const initialNodes = [];
const initialEdges = [];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [tempContent, setTempContent] = useState('');

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
      const hasIncomingEdge = edges.some((edge) => edge.target === params.target);

      if (!hasIncomingEdge) {
        setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
      } else {
        console.log(`Node ${params.target} already has an incoming edge.`);
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
    const nodeId = `${nodes.length + 1}`;
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${type}`, content: `${content} ${nodeId}` , typeIcon, color, nodeIcon },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  useEffect(() => {
    if (selectedNode) {
      setTempContent(selectedNode.data.content || '');
    }
  }, [selectedNode]);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              selected: selectedNode?.id === node.id, // Pass selected state
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
          nodeTypes={nodeTypes}
          panOnDrag={false}
          fitView
        />
      </div>
      <SidePanel
        selectedNode={selectedNode}
        tempContent={tempContent}
        setTempContent={setTempContent}
        setNodes={setNodes}
        addNode={addNode}
      />
    </div>
  );
}
