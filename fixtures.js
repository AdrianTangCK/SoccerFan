document.addEventListener('DOMContentLoaded', () => {
    const fixturesBody = document.getElementById('fixtures-body');

    // Load fixtures data from Excel file
    fetch('fixtures.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const fixtures = XLSX.utils.sheet_to_json(sheet);

            // Populate the fixtures table
            populateFixturesTable(fixtures);
        })
        .catch(error => {
            console.error('Error loading fixtures:', error);
        });

    // Function to populate the fixtures table
    function populateFixturesTable(fixtures) {
        if (fixtures.length === 0) {
            const noFixturesRow = document.createElement('tr');
            const noFixturesCell = document.createElement('td');
            noFixturesCell.colSpan = 4; // Span all columns
            noFixturesCell.textContent = 'No fixtures available.';
            noFixturesCell.style.textAlign = 'center';
            noFixturesRow.appendChild(noFixturesCell);
            fixturesBody.appendChild(noFixturesRow);
            return;
        }

        fixtures.forEach(fixture => {
            const row = document.createElement('tr');

            // Format date
            const date = new Date(fixture.Date);
            const formattedDate = date.toLocaleDateString('en-SG', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            // Add cells for each column
            const dateCell = document.createElement('td');
            dateCell.textContent = formattedDate;
            row.appendChild(dateCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = fixture.Time;
            row.appendChild(timeCell);

            const fixtureCell = document.createElement('td');
            fixtureCell.textContent = fixture.Fixture;
            row.appendChild(fixtureCell);

            const channelCell = document.createElement('td');
            channelCell.textContent = fixture.Channel;
            row.appendChild(channelCell);

            fixturesBody.appendChild(row);
        });
    }
});
