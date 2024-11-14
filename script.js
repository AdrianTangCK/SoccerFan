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
                price: parseInt(row[4]) || 0  // Directly use price as a number
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

            const price = document.createElement('td');
            price.textContent = row.price;
            tr.appendChild(price);

            tableBody.appendChild(tr);
        });
    }

    // Function to apply filters
    window.applyFilters = function() {
        const zoneFilter = document.getElementById('zone-filter').value;
        const capacityFilter = parseInt(document.getElementById('capacity-filter').value) || 0;
        const priceMinFilter = parseInt(document.getElementById('price-min-filter').value) || 0;
        const priceMaxFilter = parseInt(document.getElementById('price-max-filter').value) || Infinity;

        filteredData = screeningsData.filter(item => {
            return (!zoneFilter || item.zone === zoneFilter) &&
                   (!capacityFilter || item.capacity >= capacityFilter) &&
                   (item.price >= priceMinFilter && item.price <= priceMaxFilter);
        });

        displayData(filteredData);
    }

    // Function to reset filters
    window.resetFilters = function() {
        document.getElementById('zone-filter').value = '';
        document.getElementById('capacity-filter').value = '';
        document.getElementById('price-min-filter').value = '';
        document.getElementById('price-max-filter').value = '';
        filteredData = screeningsData;
        displayData(filteredData);
    }

    // Function to sort table
    let sortDirection = true;
    window.sortTable = function(columnIndex) {
        const columnKeys = ['name', 'address', 'zone', 'capacity', 'price'];

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
