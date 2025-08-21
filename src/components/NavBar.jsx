import React, { useRef } from 'react';
import './components.css';

export default function NavBar({ canDelete = false, onDelete, onSave, onImport, onExport }) {
  const fileInputRef = useRef(null);
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      console.log('Save clicked');
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    onDelete();
  };

  const handleExport = () => {
    onExport?.();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      onImport?.(data);
    } catch (err) {
      console.error('Failed to import JSON:', err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-title">
      <img width="160" loading="lazy" alt="" src="https://cdn.prod.website-files.com/679630f35dce1b20dcba7777/679630f35dce1b20dcba7792_a9f85bc933512ebbecac2acae2b8bed2_Group%201000021180%20%281%29.svg"/>
      </div>
      <div className="navbar-actions">
        <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportChange} />
        {canDelete && (
          <button type="button" className="navbar-button navbar-button--danger" onClick={handleDelete}>
            Delete
          </button>
        )}
                 <div className="tooltip-container">
           <button type="button" className="navbar-button" onClick={handleImportClick}>
             Import
           </button>
           <div className="tooltip">Load a saved flow from JSON file</div>
         </div>
         <div className="tooltip-container">
           <button type="button" className="navbar-button" onClick={handleExport}>
             Export
           </button>
           <div className="tooltip">Download current flow as JSON file</div>
         </div>
        <button type="button" className="navbar-button navbar-button--success" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}


