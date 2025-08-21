import React from 'react';
import { Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import "./Node.css";

function AddButton({ icon, label, onClick }) {
  return (
    <button className="add-node-button" onClick={onClick}>
      <span className="material-symbols-outlined add-node-icon">{icon}</span>
      <span className="add-node-label">{label}</span>
    </button>
  );
}

const CustomNode = ({ data }) => {
  return (
    <div className={`custom-node ${data.selected ? 'selected' : ''}`}
      style={{
        border: data.selected ? `2px solid ${data.color}` : '',
        borderRadius: '5px',
      }}
    >
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />

      <div className="custom-node-header" style={{ backgroundColor: data.color }}>
        <span className="material-symbols-outlined type-icon">{data.typeIcon}</span>
        <span>Send {data.label}</span>
        <img src={data.nodeIcon} alt="Node Icon" className="node-icon" />
      </div>
      <div className="custom-node-content">
        {data.content}
      </div>
    </div>
  );
};

export { AddButton, CustomNode };
