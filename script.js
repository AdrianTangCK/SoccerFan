/* To get data from excel file */

let screeningsData = [];  // Store the parsed data
let filteredData = [];    // Store the filtered data for display

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('screenings-body');

    // Load and parse the Excel file
    fetch('screenings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Convert JSON data and remove header row
            screeningsData = jsonData.slice(1).map(row => ({
                name: row[0],
                address: row[1],
                zone: row[2],
                capacity: parseInt(row[3]) || 0,
                cost: row[4]
            }));

            filteredData = screeningsData;
            displayData(filteredData);
        });

    // Function to display data in table
    function displayData(data) {
        tableBody.innerHTML = '';  // Clear existing data
        data.forEach(row => {
            const tr = document.createElement('tr');

            const locationName = document.createElement('td');
            locationName.textContent = row.name;
            tr.appendChild(locationName);

            const address = document.createElement('td');
            address.textContent = row.address;
            tr.appendChild(address);

            const zone = document.createElement('td');
            zone.textContent = row.zone;
            tr.appendChild(zone);

            const capacity = document.createElement('td');
            capacity.textContent = row.capacity;
            tr.appendChild(capacity);

            const cost = document.createElement('td');
            cost.textContent = row.cost;
            tr.appendChild(cost);

            tableBody.appendChild(tr);
        });
    }

    // Function to apply filters
    window.applyFilters = function() {
        const zoneFilter = document.getElementById('zone-filter').value;
        const capacityFilter = document.getElementById('capacity-filter').value;

        filteredData = screeningsData.filter(item => {
            return (!zoneFilter || item.zone === zoneFilter) &&
                   (!capacityFilter || item.capacity >= parseInt(capacityFilter));
        });

        displayData(filteredData);
    }

    // Function to reset filters
    window.resetFilters = function() {
        document.getElementById('zone-filter').value = '';
        document.getElementById('capacity-filter').value = '';
        filteredData = screeningsData;
        displayData(filteredData);
    }

    // Function to sort table
    let sortDirection = true;
    window.sortTable = function(columnIndex) {
        const columnKeys = ['name', 'address', 'zone', 'capacity', 'cost'];

        filteredData.sort((a, b) => {
            const aValue = a[columnKeys[columnIndex]];
            const bValue = b[columnKeys[columnIndex]];

            if (aValue < bValue) return sortDirection ? -1 : 1;
            if (aValue > bValue) return sortDirection ? 1 : -1;
            return 0;
        });

        sortDirection = !sortDirection;  // Toggle sort direction
        displayData(filteredData);
    }
});
