document.addEventListener('DOMContentLoaded', () => {
    const fixturesList = document.getElementById('fixtures-list');
    const tableBody = document.getElementById('screenings-body');
    let screeningsData = []; // To store parsed table data
    let filteredData = [];   // To store filtered table data

    // Load and display upcoming fixtures for the next 7 days
    fetch('fixtures.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract fixtures from Excel
            const fixturesData = jsonData.slice(1).map(row => ({
                date: new Date(`${row[0]} ${row[1]}`), // Combine Date and Time columns
                event: row[2], // Fixture column
                channel: row[3] // Channel column
            }));

            // Filter fixtures for the next 7 days
            const now = new Date();
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(now.getDate() + 7);

            const upcomingFixtures = fixturesData.filter(fixture => {
                return fixture.date >= now && fixture.date <= sevenDaysLater;
            });

            displayFixtures(upcomingFixtures);
        });

    // Function to display fixtures
    function displayFixtures(fixtures) {
        fixturesList.innerHTML = ''; // Clear existing fixtures

        if (fixtures.length === 0) {
            const noFixturesMessage = document.createElement('li');
            noFixturesMessage.textContent = 'No fixtures scheduled for the next 7 days.';
            noFixturesMessage.style.textAlign = 'center';
            noFixturesMessage.style.color = '#6c757d';
            fixturesList.appendChild(noFixturesMessage);
            return;
        }

        fixtures.forEach(fixture => {
            const li = document.createElement('li');

            const dateSpan = document.createElement('span');
            dateSpan.className = 'fixture-date';
            dateSpan.textContent = fixture.date.toLocaleString('en-SG', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

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
            screeningsData = jsonData.slice(1).map(row => ({
                name: row[0],
                address: row[1],
                zone: row[2],
                capacity: parseInt(row[3]) || 0,
                price: parseInt(row[4]) || 0 // Price column as a number
            }));

            filteredData = screeningsData; // Initialize filteredData with all data
            displayScreenings(filteredData);
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
        filteredData = screeningsData.filter(item => {
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
        filteredData = screeningsData;
        displayScreenings(filteredData);
    };

    let sortDirection = true; // Sort ascending by default
    window.sortTable = function(columnIndex) {
        const columnKeys = ['name', 'address', 'zone', 'capacity', 'price'];

        filteredData.sort((a, b) => {
            const aValue = a[columnKeys[columnIndex]];
            const bValue = b[columnKeys[columnIndex]];

            if (aValue < bValue) return sortDirection ? -1 : 1;
            if (aValue > bValue) return sortDirection ? 1 : -1;
            return 0;
        });

        sortDirection = !sortDirection; // Toggle sort direction
        displayScreenings(filteredData);
    };
});
