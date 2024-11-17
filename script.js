document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('screenings-body');
    const fixturesList = document.getElementById('fixtures-list');

    // Load and display upcoming fixtures
    fetch('fixtures.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract fixtures from Excel
            const fixturesData = jsonData.slice(1).map(row => ({
                date: row[0], // Date column
                time: row[1], // Time column
                event: row[2], // Fixture column
                channel: row[3] // Channel column
            }));

            displayFixtures(fixturesData);
        });

    // Function to display fixtures
    function displayFixtures(fixtures) {
        fixturesList.innerHTML = ''; // Clear existing fixtures

        fixtures.forEach(fixture => {
            const li = document.createElement('li');

            const dateSpan = document.createElement('span');
            dateSpan.className = 'fixture-date';
            dateSpan.textContent = `${fixture.date} ${fixture.time}`;

            const eventSpan = document.createElement('span');
            eventSpan.className = 'fixture-event';
            eventSpan.textContent = fixture.event;

            const channelSpan = document.createElement('span');
            channelSpan.className = 'fixture-channel';
            channelSpan.textContent = fixture.channel;

            li.appendChild(dateSpan);
            li.appendChild(eventSpan);
            li.appendChild(channelSpan);

            fixturesList.appendChild(li);
        });
    }

    // Load and parse the Excel file for table data
    fetch('screenings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Convert JSON data and remove header row
            const screeningsData = jsonData.slice(1).map(row => ({
                name: row[0],
                address: row[1],
                zone: row[2],
                capacity: parseInt(row[3]) || 0,
                price: parseInt(row[4]) || 0 // Price column as a number
            }));

            displayScreenings(screeningsData);
        });

    // Function to display data in the table
    function displayScreenings(data) {
        tableBody.innerHTML = ''; // Clear existing data

        data.forEach(row => {
            const tr = document.createElement('tr');

            // Make Location Name clickable, linking to Google Maps
            const locationName = document.createElement('td');
            const locationLink = document.createElement('a');
            locationLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.name)}`;
            locationLink.textContent = row.name;
            locationLink.target = '_blank'; // Open in a new tab
            locationLink.style.color = '#1d3557'; // Optional: link color
            locationName.appendChild(locationLink);
            tr.appendChild(locationName);

            // Keep Address as plain text (no link)
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

    // Filtering and sorting logic
    window.applyFilters = function() {
        const zoneFilter = document.getElementById('zone-filter').value;
        const capacityFilter = parseInt(document.getElementById('capacity-filter').value) || 0;
        const priceMaxFilter = parseInt(document.getElementById('price-max-filter').value) || Infinity;

        // Filter data based on zone, capacity, and max price
        const filteredData = screeningsData.filter(item => {
            return (!zoneFilter || item.zone === zoneFilter) &&
                   (!capacityFilter || item.capacity >= capacityFilter) &&
                   (item.price <= priceMaxFilter);
        });

        displayScreenings(filteredData);
    };

    window.resetFilters = function() {
        document.getElementById('zone-filter').value = '';
        document.getElementById('capacity-filter').value = '';
        document.getElementById('price-max-filter').value = '';
        displayScreenings(screeningsData);
    };

    let sortDirection = true; // Sort ascending by default
    window.sortTable = function(columnIndex) {
        const columnKeys = ['name', 'address', 'zone', 'capacity', 'price'];

        const sortedData = filteredData.sort((a, b) => {
            const aValue = a[columnKeys[columnIndex]];
            const bValue = b[columnKeys[columnIndex]];

            if (aValue < bValue) return sortDirection ? -1 : 1;
            if (aValue > bValue) return sortDirection ? 1 : -1;
            return 0;
        });

        sortDirection = !sortDirection; // Toggle sort direction
        displayScreenings(sortedData);
    };
});
