function writeGroupstoHTML(groups) {
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

function collectElementsForKey(data, key) {
    var list = data.map(function (item) {
        return item[key];
    }).filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
    return list;
}
function load_csv(file, callback) {
    Papa.parse(file, {
        header: true,  // use first row as header row
        download: true,  // download file from server
        complete: function (results) {
            // create a dictionary object from the parsed data
            return callback(results)
        }
    })
}

function seperateGroups(results) {

    var selectedStringToNum = {
        "Gruppengröße": 1,
        "Gruppenanzahl": 2
    }

    var mode = document.getElementById('mode').value
    mode = selectedStringToNum[mode];
    var number = parseInt(document.getElementById('number').value);
    console.log(number)
    data = results.data
    dataDict = []
    data.forEach(row => {
        dataDict = [...dataDict, row]
    });

    names = dataDict.map(x => x["Vorname"])
    numParticipants = names.length;
    document.getElementById('groups_header').style.visibility = 'visible'
    document.getElementById('tn').innerHTML = `<b>Anzahl Namen:</b> ${numParticipants}`;

    names = shuffleArray(names)

    numberOfGroups = mode == 1 ? Math.floor(numParticipants / number) : number
    groupSize = mode == 1 ? number : Math.floor(numParticipants / number);
    groups = chunkArray(names, groupSize)
    console.log(groups)
    document.getElementById('tg').innerHTML = `<b>Anzahl Gruppen:</b> ${groups.length}`;
    writeGroupstoHTML(groups.map(group => group.join(", ")))
    return dataDict
}

function generateGroups() {
    var file = document.getElementById('names').files[0];
    console.log(file)

    // read the CSV file

    console.log(load_csv(file, seperateGroups))

}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
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