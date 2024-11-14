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

            // Make Location Name clickable, linking to Google Maps
            const locationName = document.createElement('td');
            const locationLink = document.createElement('a');
            locationLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.name)}`;
            locationLink.textContent = row.name;
            locationLink.target = '_blank';  // Open in a new tab
            locationLink.style.color = '#1d3557';  // Optional: link color
            locationName.appendChild(locationLink);
            tr.appendChild(locationName);

            // Make Address clickable, linking to Google Maps
            const address = document.createElement('td');
            const addressLink = document.createElement('a');
            addressLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.address)}`;
            addressLink.textContent = row.address;
            addressLink.target = '_blank';  // Open in a new tab
            addressLink.style.color = '#1d3557';  // Optional: link color
            address.appendChild(addressLink);
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
        const priceMaxFilter = parseInt(document.getElementById('price-max-filter').value) || Infinity;

        // Filter data based on zone, capacity, and max price
        filteredData = screeningsData.filter(item => {
            return (!zoneFilter || item.zone === zoneFilter) &&
                   (!capacityFilter || item.capacity >= capacityFilter) &&
                   (item.price <= priceMaxFilter);
        });

        displayData(filteredData);
    }

    // Function to reset filters
    window.resetFilters = function() {
        document.getElementById('zone-filter').value = '';
        document.getElementById('capacity-filter').value = '';
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
