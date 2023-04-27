function writeGroupsToHTML(groups) {
    const table = document.getElementById('groups');
    table.innerHTML = ''
    // Create a new row for the table header
    const headerRow = table.insertRow();
    const header1 = headerRow.insertCell(0);
    const header2 = headerRow.insertCell(1);
    header1.innerHTML = '<b><i class="fas fa-hashtag"></i> Gruppen-Nr.</b>';
    header2.innerHTML = '<b>Mitglieder</b>';

    // Create a row for each key-value pair in the object
    groupNumber = 1
    for (members of groups) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = groupNumber;
        cell2.innerHTML = members;
        groupNumber++;
    }
}
function changeLabel() {
    var mode = document.getElementById('mode').value;
    document.getElementById('label_mode').innerHTML = mode;
}

function loadCSV(file, callback) {
    Papa.parse(file, {
        header: true,  // use first row as header row
        download: true,  // download file from server
        complete: function (results) {
            // create a dictionary object from the parsed data
            return callback(results)
        }
    })
}

function writeNamesToTextArea(results) {
    data = results.data;
    dataDict = [];
    data.forEach(row => {
        dataDict = [...dataDict, row]
    });

    firstNames = dataDict.map(x => x["Vorname"]);
    duplicateNames = firstNames.filter(
        (firstName, index) => 
        index == firstNames.indexOf(firstName) & index != firstNames.lastIndexOf(firstName)
    );
    if (duplicateNames.length != 0) {
        firstNames = dataDict.map(
            x => duplicateNames.includes(x["Vorname"]) ?
                `${x["Vorname"]} ${x["Nachname"]}` : x["Vorname"]
        );
    }
    oneNamePerLine = firstNames.join("\n");
    document.getElementById('names').style.display = 'block';
    document.getElementById('names_label').style.display = 'block';
    document.getElementById('names').value = oneNamePerLine;

}

function separateGroups(names) {
    var selectedStringToNum = {
        "Gruppengröße": 1,
        "Gruppenanzahl": 2
    }

    var mode = document.getElementById('mode').value
    mode = selectedStringToNum[mode];
    var number = parseInt(document.getElementById('number').value);

    numParticipants = names.length;
    document.getElementById('groups_header').style.visibility = 'visible'
    document.getElementById('tn').innerHTML = `<b>Anzahl Namen:</b> ${numParticipants}`;

    names = shuffleArray(names)

    numberOfGroups = mode == 1 ? Math.floor(numParticipants / number) : number
    groupSize = mode == 1 ? number : Math.floor(numParticipants / number);
    groups = chunkArray(names, groupSize)
    document.getElementById('tg').innerHTML = `<b>Anzahl Gruppen:</b> ${groups.length}`;
    writeGroupsToHTML(groups.map(group => group.join(", ")))
    return dataDict
}

function loadNames() {
    var file = document.getElementById('names_file').files[0];

    // Read the CSV file and write the first names to a Textarea

    loadCSV(file, writeNamesToTextArea);

}

function generateGroups() {
    var names = document.getElementById('names').value;
    names = names.split("\n");
    separateGroups(names);
}

/**
 * Shuffles array in place.
 * @param {Array} array items The array containing the items.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function chunkArray(array, chunkSize) {
    const chunkedArray = [];
    let startIndex = 0;
    let endIndex = chunkSize;

    while (startIndex < array.length) {
        let chunk = array.slice(startIndex, endIndex);

        if (chunk.length == chunkSize || startIndex == 0) {
            chunkedArray.push(chunk);;
        } else {
            // Add leftover elements to a random chunk
            let randomIndex = Math.floor(Math.random() * chunkedArray.length);
            chunkedArray[randomIndex] = chunkedArray[randomIndex].concat(chunk)
        }

        startIndex = endIndex;
        endIndex += chunkSize;
    }

    return chunkedArray;
}

function count(array) {
    counts = {}
    array.forEach((el) => {
        counts[el] = counts[el] ? (counts[el] + 1) : 1;
    });
    return counts
}