export const MOCK_CITY_OVERVIEW = {
    cityName: 'Visakhapatnam (GVMC)',
    state: 'Andhra Pradesh',
    totalPopulation: 2350000,
    overallRiskScore: 68,
    riskCategory: 'High Risk',
    monsoonStatus: 'Severe Monsoon Warning (Stage 3)',
    lastUpdated: '2 mins ago',
    activeSheltersCount: 38,
    totalSheltersCount: 45,
    shelterCapacityTotal: 18500,
    shelterOccupancyTotal: 12420,
    pendingReportsCount: 14,
    activeCriticalAlertsCount: 4,
};
export const MOCK_WEATHER = {
    temperatureC: 27.4,
    humidityPercent: 89,
    rainfallMmHr: 42.8,
    rainfallCumulative24h: 184.2,
    windSpeedKmH: 34.5,
    windDirection: 'SSW',
    pressureHpa: 998.2,
    tideLevelMeters: 2.15,
    seaLevelTrend: 'Rising (+0.12m/hr)',
    forecast6h: 'Heavy to very heavy rainfall expected in coastal wards.',
};
export const MOCK_WARDS = [
    { id: 'w14', name: 'Gajuwaka Industrial Zone', number: 14, riskScore: 92, riskCategory: 'Critical', population: 84000, elevationMeters: 3.2, waterLevelCm: 68, rainfallMmHr: 54.2, activeAlertsCount: 2 },
    { id: 'w08', name: 'One Town Old City', number: 8, riskScore: 88, riskCategory: 'Critical', population: 112000, elevationMeters: 2.8, waterLevelCm: 58, rainfallMmHr: 49.0, activeAlertsCount: 1 },
    { id: 'w03', name: 'Maharanipeta Coastal Belt', number: 3, riskScore: 84, riskCategory: 'Critical', population: 76000, elevationMeters: 4.1, waterLevelCm: 45, rainfallMmHr: 46.5, activeAlertsCount: 1 },
    { id: 'w22', name: 'Sheela Nagar Lowlands', number: 22, riskScore: 81, riskCategory: 'Critical', population: 63000, elevationMeters: 2.5, waterLevelCm: 52, rainfallMmHr: 51.0, activeAlertsCount: 1 },
    { id: 'w11', name: 'Seethammadhara', number: 11, riskScore: 74, riskCategory: 'High', population: 95000, elevationMeters: 8.5, waterLevelCm: 28, rainfallMmHr: 38.2, activeAlertsCount: 0 },
    { id: 'w16', name: 'Muralinagar Drainage Basin', number: 16, riskScore: 71, riskCategory: 'High', population: 68000, elevationMeters: 6.2, waterLevelCm: 34, rainfallMmHr: 41.0, activeAlertsCount: 0 },
    { id: 'w05', name: 'Dwaraka Nagar', number: 5, riskScore: 65, riskCategory: 'High', population: 104000, elevationMeters: 11.0, waterLevelCm: 18, rainfallMmHr: 32.5, activeAlertsCount: 0 },
    { id: 'w19', name: 'Gopalapatnam', number: 19, riskScore: 58, riskCategory: 'Medium', population: 89000, elevationMeters: 14.2, waterLevelCm: 12, rainfallMmHr: 28.0, activeAlertsCount: 0 },
    { id: 'w02', name: 'MVP Colony', number: 2, riskScore: 52, riskCategory: 'Medium', population: 120000, elevationMeters: 16.5, waterLevelCm: 8, rainfallMmHr: 24.5, activeAlertsCount: 0 },
    { id: 'w25', name: 'Pendurthi Foothills', number: 25, riskScore: 42, riskCategory: 'Medium', population: 78000, elevationMeters: 22.0, waterLevelCm: 5, rainfallMmHr: 21.0, activeAlertsCount: 0 },
    { id: 'w01', name: 'Rushikonda IT Park Area', number: 1, riskScore: 28, riskCategory: 'Low', population: 45000, elevationMeters: 38.0, waterLevelCm: 2, rainfallMmHr: 16.0, activeAlertsCount: 0 },
    { id: 'w30', name: 'Simhachalam Ridge', number: 30, riskScore: 12, riskCategory: 'Very Low', population: 32000, elevationMeters: 115.0, waterLevelCm: 0, rainfallMmHr: 12.0, activeAlertsCount: 0 },
];
export const MOCK_SHELTERS = [
    { id: 'sh-01', name: 'GVMC High School Relief Center', wardName: 'Gajuwaka', address: 'Main Rd, Ward 14, Gajuwaka', capacity: 1200, currentOccupancy: 1050, contactPhone: '+91 891 270 4123', isAccessible: true, amenities: ['Food Station', 'Medical Desk', 'Power Backup', 'Clean Water'], status: 'Near Capacity', lat: 17.6868, lng: 83.2185 },
    { id: 'sh-02', name: 'St. Aloysius High School Shelter', wardName: 'One Town', address: 'Beach Rd, Old City', capacity: 800, currentOccupancy: 780, contactPhone: '+91 891 256 8921', isAccessible: true, amenities: ['Food Station', 'Medical Desk', 'Sanitation Kits'], status: 'Near Capacity', lat: 17.7012, lng: 83.3021 },
    { id: 'sh-03', name: 'Andhra University Indoor Stadium', wardName: 'Maharanipeta', address: 'AU Campus, Visakhapatnam', capacity: 3500, currentOccupancy: 1820, contactPhone: '+91 891 284 4000', isAccessible: true, amenities: ['Mass Canteen', 'ICU Beds', 'Children Play Area', 'Generators'], status: 'Open', lat: 17.7289, lng: 83.3184 },
    { id: 'sh-04', name: 'Swarna Bharathi Indoor Arena', wardName: 'Dwaraka Nagar', address: 'Resapu vanipalem', capacity: 2500, currentOccupancy: 1100, contactPhone: '+91 891 275 1122', isAccessible: true, amenities: ['Food Station', 'First Aid', 'Blankets'], status: 'Open', lat: 17.7215, lng: 83.3045 },
    { id: 'sh-05', name: 'Government Junior College Relief Camp', wardName: 'Sheela Nagar', address: 'Bypass Highway Rd', capacity: 1000, currentOccupancy: 980, contactPhone: '+91 891 254 9911', isAccessible: false, amenities: ['Food Packets', 'Water Tankers'], status: 'Near Capacity', lat: 17.6954, lng: 83.2412 },
    { id: 'sh-06', name: 'VIMS Super Specialty Complex', wardName: 'Muralinagar', address: 'Hanumanthawaka', capacity: 1500, currentOccupancy: 450, contactPhone: '+91 891 286 7000', isAccessible: true, amenities: ['Full Trauma Care', 'Helipad Access', 'Oxygen Plant'], status: 'Open', lat: 17.7512, lng: 83.3321 },
];
export const MOCK_CROWD_REPORTS = [
    { id: 'rep-101', reporterName: 'K. Ramesh', wardName: 'Gajuwaka Industrial Zone', timestamp: '10 mins ago', title: 'Drainage Canal Overflowing onto Main Road', description: 'Water level reached 2.5 feet near Gajuwaka junction. Vehicles stranded.', severity: 'Critical', status: 'Pending', waterDepthEst: '75 cm (2.5 ft)', aiLabels: ['Severe Flooding', 'Stranded Bus', 'Blocked Drain'], aiConfidence: 0.94, upvotes: 28 },
    { id: 'rep-102', reporterName: 'Priya Sharma', wardName: 'One Town Old City', timestamp: '25 mins ago', title: 'Seawater Surge Inundating Low-lying Alleyways', description: 'High tide combined with heavy rain causing sea water entry into ground floor houses.', severity: 'High', status: 'Verified', waterDepthEst: '50 cm (1.6 ft)', aiLabels: ['Tidal Surge', 'Submerged Alley'], aiConfidence: 0.91, upvotes: 42 },
    { id: 'rep-103', reporterName: 'M. Apparao', wardName: 'Maharanipeta Coastal Belt', timestamp: '42 mins ago', title: 'Tree Collapse Damaged Power Line', description: 'Banyan tree fell across coastal road near RK beach entrance. Live electrical wire down.', severity: 'Critical', status: 'Verified', waterDepthEst: '30 cm (1.0 ft)', aiLabels: ['Fallen Tree', 'Power Line Hazard'], aiConfidence: 0.97, upvotes: 56 },
    { id: 'rep-104', reporterName: 'S. Lakshmi', wardName: 'Sheela Nagar Lowlands', timestamp: '1 hour ago', title: 'Elderly Residents Trapped in Ground Floor', description: '3 elderly citizens require immediate boat rescue due to rising creek water.', severity: 'Critical', status: 'Verified', waterDepthEst: '90 cm (3.0 ft)', aiLabels: ['Trapped Persons', 'High Water'], aiConfidence: 0.96, upvotes: 64 },
    { id: 'rep-105', reporterName: 'V. Suresh', wardName: 'Seethammadhara', timestamp: '2 hours ago', title: 'Minor Water Stagnation near Market', description: 'Water accumulating near vegetable market, slow moving traffic.', severity: 'Medium', status: 'Resolved', waterDepthEst: '20 cm (0.6 ft)', aiLabels: ['Mild Waterlogging'], aiConfidence: 0.88, upvotes: 12 },
];
export const MOCK_ALERTS = [
    { id: 'alt-501', title: 'FLASH FLOOD EMERGENCY BROADCAST', severity: 'Critical', affectedWards: ['Gajuwaka (Ward 14)', 'Sheela Nagar (Ward 22)'], issuedAt: '15 mins ago', message: 'Immediate evacuation advised for residents living within 200m of Meghadrigedda reservoir outlet stream due to gate opening.', issuedBy: 'District Collector & Head of Disaster Management', active: true },
    { id: 'alt-502', title: 'High Tide & Coastal Storm Surge Advisory', severity: 'Severe', affectedWards: ['One Town (Ward 8)', 'Maharanipeta (Ward 3)'], issuedAt: '45 mins ago', message: 'Peak tide of 2.4m expected at 18:30 IST. Coastal roads closed for non-emergency traffic.', issuedBy: 'GVMC Flood Control Room', active: true },
    { id: 'alt-503', title: 'Red Heavy Rainfall Warning (IMD)', severity: 'Warning', affectedWards: ['All Coastal Wards (1 to 15)'], issuedAt: '3 hours ago', message: 'Extremely heavy rainfall (>200mm in 24h) forecasted for next 18 hours due to Bay of Bengal depression.', issuedBy: 'India Meteorological Department', active: true },
];
export const MOCK_RAINFALL_SERIES = [
    { time: '00:00', actualRainfall: 12, predictedRainfall: 14, waterLevel: 15 },
    { time: '04:00', actualRainfall: 18, predictedRainfall: 19, waterLevel: 22 },
    { time: '08:00', actualRainfall: 35, predictedRainfall: 32, waterLevel: 38 },
    { time: '12:00', actualRainfall: 48, predictedRainfall: 45, waterLevel: 55 },
    { time: '16:00 (Now)', actualRainfall: 54, predictedRainfall: 52, waterLevel: 68 },
    { time: '+2h (TFT)', actualRainfall: null, predictedRainfall: 62, waterLevel: 78 },
    { time: '+4h (TFT)', actualRainfall: null, predictedRainfall: 70, waterLevel: 85 },
    { time: '+6h (TFT)', actualRainfall: null, predictedRainfall: 55, waterLevel: 80 },
    { time: '+12h (TFT)', actualRainfall: null, predictedRainfall: 30, waterLevel: 60 },
    { time: '+24h (TFT)', actualRainfall: null, predictedRainfall: 10, waterLevel: 30 },
];
export const MOCK_RISK_DISTRIBUTION = [
    { category: 'Critical', count: 4, percentage: 33, color: '#EF4444' },
    { category: 'High', count: 3, percentage: 25, color: '#F97316' },
    { category: 'Medium', count: 3, percentage: 25, color: '#EAB308' },
    { category: 'Low', count: 1, percentage: 8, color: '#84CC16' },
    { category: 'Very Low', count: 1, percentage: 9, color: '#22C55E' },
];
export const MOCK_ACTIVITY_FEED = [
    { id: 'act-1', timestamp: 'Just now', type: 'AI Warning', text: 'Temporal Fusion Transformer updated 6h prediction: Ward 14 risk score escalated to 92/100.', severity: 'critical' },
    { id: 'act-2', timestamp: '4 mins ago', type: 'Crowd Report', text: 'New photo report submitted from Gajuwaka: YOLOv11 detected 75cm water depth.', severity: 'high' },
    { id: 'act-3', timestamp: '12 mins ago', type: 'Shelter Update', text: 'GVMC High School Shelter reached 87.5% capacity (1,050 / 1,200).', severity: 'warning' },
    { id: 'act-4', timestamp: '18 mins ago', type: 'Evacuation Route', text: 'GNN Engine dynamically rerouted Route EV-04 via NH-16 to avoid flooded bypass.', severity: 'info' },
    { id: 'act-5', timestamp: '30 mins ago', type: 'Gov Dispatch', text: 'NDRF Team 4 dispatched to Sheela Nagar for elderly citizen rescue.', severity: 'success' },
];
//# sourceMappingURL=mockData.js.map