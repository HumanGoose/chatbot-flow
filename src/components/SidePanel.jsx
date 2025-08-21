import React from 'react';
import {AddButton} from './Node.jsx';
import WhatsAppIcon from '../assets/whatsapp.png';

export default function SidePanel({
  selectedNode,
  tempContent,
  setTempContent,
  setNodes,
  addNode,
}) {
  return (
    <div style={{ width: '400px', padding: '10px', borderLeft: '1px solid #ddd' }}>
      {!selectedNode ? (
        <>
          <AddButton icon="chat" label="Message" onClick={() => addNode('Message', 'Enter text message', 'chat', '#b1f0c3', WhatsAppIcon)} />
        </>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '5px' }}>
                {selectedNode.data.label}
            </h3>
            <hr style={{ width: '100%', borderTop: '1px solid #ccc', marginBottom: '15px' }} />
            <label style={{ alignSelf: 'flex-start', marginLeft: '5%', marginBottom: '5px', fontWeight: 'bold' }}>
                Text
            </label>
          {selectedNode.data.label.includes('Message') && (
            <textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    setNodes((nds) =>
                    nds.map((n) =>
                        n.id === selectedNode.id
                        ? { ...n, data: { ...n.data, content: tempContent } }
                        : n
                    )
                    );
                    e.preventDefault();
                }
                }}
                rows={5}
                style={{
                width: '90%',
                padding: '8px',
                fontSize: '16px',
                marginTop: '10px',
                resize: 'vertical', 
                }}
            />
          )}
          </div>
        </>
      )}
    </div>
  );
}