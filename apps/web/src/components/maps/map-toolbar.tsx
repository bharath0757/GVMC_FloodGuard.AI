import * as React from 'react';
import { Search } from 'lucide-react';

interface MapToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStyle: string;
  onStyleChange: (s: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (f: string) => void;
  onSearchSelect: (q: string) => void;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStyle,
  onStyleChange,
  severityFilter,
  onSeverityFilterChange,
  onSearchSelect,
}) => {
  return (
    <div className="absolute top-3 right-16 z-20 flex items-center space-x-2">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearchSelect(searchQuery);
          }}
          placeholder="Search Ward, Shelter (e.g. Gajuwaka)..."
          className="h-9 w-64 rounded-xl border border-slate-800 bg-slate-950/90 pl-8 pr-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 shadow-2xl backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Severity Filter Dropdown */}
      <div className="relative">
        <select
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value)}
          className="h-9 rounded-xl border border-slate-800 bg-slate-950/90 px-3 text-xs font-mono text-slate-200 shadow-2xl backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="ALL">All Severities</option>
          <option value="Critical">Critical Only</option>
          <option value="High">High Severity</option>
          <option value="Medium">Medium Severity</option>
        </select>
      </div>

      {/* Style Selector */}
      <div className="relative">
        <select
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value)}
          className="h-9 rounded-xl border border-slate-800 bg-slate-950/90 px-3 text-xs font-mono text-slate-200 shadow-2xl backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="dark">CartoDB Dark</option>
          <option value="streets">OpenStreetMap</option>
          <option value="satellite">Satellite Imagery</option>
          <option value="light">Light Cadastral</option>
        </select>
      </div>
    </div>
  );
};
