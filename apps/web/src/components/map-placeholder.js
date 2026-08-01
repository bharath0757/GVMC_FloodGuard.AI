import { jsx as _jsx } from "react/jsx-runtime";
import { MapContainer } from './maps';
export const MapPlaceholder = ({ className, height = '520px', selectedWardId = 'w14', onSelectWard, }) => {
    return (_jsx("div", { className: className, children: _jsx(MapContainer, { selectedWardId: selectedWardId, onSelectWard: onSelectWard, height: height }) }));
};
//# sourceMappingURL=map-placeholder.js.map