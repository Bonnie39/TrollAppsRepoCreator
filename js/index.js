let appCount = 0;
const copiedText = document.getElementById("copied");

function addApp() {
    appCount++;
    const appsContainer = document.getElementById('appsContainer');

    const appDiv = document.createElement('div');
    appDiv.classList.add('app');
    appDiv.innerHTML = `
        <h2>App ${appCount}</h2>

        <label for="appName${appCount}">App Name:</label>
        <input type="text" class="appName">

        <label for="appBundleIdentifier${appCount}">Bundle Identifier:</label>
        <input type="text" class="appBundleIdentifier">

        <!-- Add other app information fields -->

        <label for="appIconURL${appCount}">App Icon URL:</label>
        <input type="text" class="appIconURL">

        <label for="appTintColor${appCount}">App Tint Color:</label>
        <input type="text" class="appTintColor">

        <div class="versionsContainer"></div>

        <button class="addVersionBtn">+ Add Version</button>
    `;

    appsContainer.appendChild(appDiv);
}

function addVersion(event) {
    const button = event.target;
    const appDiv = button.closest('.app');

    if (!appDiv) {
        console.error('App element not found');
        return;
    }

    const versionsContainer = appDiv.querySelector('.versionsContainer');
    const versionCount = versionsContainer.childElementCount + 1;

    const versionDiv = document.createElement('div');
    versionDiv.classList.add('version'); // Add the 'version' class
    versionDiv.innerHTML = `
        <h3>Version ${versionCount}</h3>

        <label for="appVersion">Version:</label>
        <input type="text" class="appVersion">

        <!-- Add other version information fields -->

        <label for="appDownloadURL">Download URL:</label>
        <input type="text" class="appDownloadURL">

        <label for="appSize">Size:</label>
        <input type="text" class="appSize">
    `;

    versionsContainer.appendChild(versionDiv);
}


document.addEventListener('click', function (event) {
    if (event.target.classList.contains('addVersionBtn')) {
        addVersion(event);
    }
});


function generateRepo() {
    const repoName = document.getElementById('repoName').value;
    const repoSubtitle = document.getElementById('repoSubtitle').value;
    const repoDescription = document.getElementById('repoDescription').value;
    const repoIconURL = document.getElementById('repoIconURL').value;
    const repoHeaderURL = document.getElementById('repoHeaderURL').value;
    const repoWebsite = document.getElementById('repoWebsite').value;
    const repoTintColor = document.getElementById('repoTintColor').value;

    if (!repoName) {
        console.error("Repo Name is required!");
        return;
    }

    const appsContainer = document.getElementById('appsContainer');
    const appDivs = appsContainer.querySelectorAll('.app');
    
    const repoJSON = {
        "name": repoName,
        "subtitle": repoSubtitle,
        "description": repoDescription,
        "iconURL": repoIconURL,
        "headerURL": repoHeaderURL,
        "website": repoWebsite,
        "tintColor": repoTintColor,
        "featuredApps": [],
        "apps": [],
        "news": []
    };

    appDivs.forEach((appDiv) => {
        const appName = appDiv.querySelector('.appName').value;
        const appBundleIdentifier = appDiv.querySelector('.appBundleIdentifier').value;
        const appIconURL = appDiv.querySelector('.appIconURL').value;
        const appTintColor = appDiv.querySelector('.appTintColor').value;

        const versionsContainer = appDiv.querySelector('.versionsContainer');
        const versionDivs = versionsContainer.querySelectorAll('div');

        const appObj = {
            "name": appName,
            "bundleIdentifier": appBundleIdentifier,
            "iconURL": appIconURL,
            "tintColor": appTintColor,
            "versions": [],
            "appPermissions": {},
        };

        versionDivs.forEach((versionDiv) => {
            const appVersion = versionDiv.querySelector('.appVersion').value;
            const appDownloadURL = versionDiv.querySelector('.appDownloadURL').value;
            const appSize = versionDiv.querySelector('.appSize').value;

            const versionObj = {
                "version": appVersion,
                "downloadURL": appDownloadURL,
                "size": appSize
            };

            appObj.versions.push(versionObj);
        });

        repoJSON.apps.push(appObj);
    });

    const outputJson = JSON.stringify(repoJSON, null, 2);
    //console.log(outputJson);

    navigator.clipboard.writeText(outputJson)
        .then(() => {
            console.log("JSON copied to clipboard:", outputJson);
        })
        .catch((error) => {
            console.error("Error copying JSON to clipboard:", error);
        });

        showAndHideCopiedText();
}

function importRepo() {
    //const importRepoInput = document.getElementById('importRepo');
    const importRepoURLInput = document.getElementById('importRepoURL');
    appCount = 0;
    updateImagePreview();

    /*if (importRepoInput.files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            const importedData = JSON.parse(event.target.result);
            fillRepoData(importedData);
        };
        fileReader.readAsText(importRepoInput.files[0]);
    } else if (importRepoURLInput.value.trim() !== '') {
        fetch(importRepoURLInput.value)
            .then(response => response.json())
            .then(data => fillRepoData(data))
            .catch(error => console.error('Error fetching JSON:', error));
    } else {
        console.error('Please select a file or enter a JSON URL.');
    }*/

    if(importRepoURLInput.value.trim() !== '') {
        fetch(importRepoURLInput.value)
            .then(response => response.json())
            .then(data => fillRepoData(data))
            .catch(error => console.error('Error fetching JSON:', error));
    } else {
        console.error('Please select a file or enter a JSON URL.');
    }
}

function fillRepoData(importedData) {
    document.getElementById('repoName').value = importedData.name || '';
    document.getElementById('repoSubtitle').value = importedData.subtitle || '';
    document.getElementById('repoDescription').value = importedData.description || '';
    document.getElementById('repoIconURL').value = importedData.iconURL || '';
    document.getElementById('repoHeaderURL').value = importedData.headerURL || '';
    document.getElementById('repoWebsite').value = importedData.website || '';
    document.getElementById('repoTintColor').value = importedData.tintColor || '';

    // Clear existing apps and versions
    document.getElementById('appsContainer').innerHTML = '';

    // Add imported apps and versions
    importedData.apps.forEach((app) => {
        addApp();

        const appDiv = document.querySelector('.app:last-of-type');
        appDiv.querySelector('.appName').value = app.name || '';
        appDiv.querySelector('.appBundleIdentifier').value = app.bundleIdentifier || '';
        appDiv.querySelector('.appIconURL').value = app.iconURL || '';
        appDiv.querySelector('.appTintColor').value = app.tintColor || '';

        // Check if versions exist before adding them
        if (app.versions && app.versions.length > 0) {
            app.versions.forEach(() => {
                addVersion({ target: appDiv.querySelector('.addVersionBtn') });
            });

            // Fill in version details
            const versionDivs = appDiv.querySelectorAll('.versionsContainer .version');
            console.log('versionDivs:', versionDivs); // Debugging statement
            app.versions.forEach((version, index) => {
                const versionDiv = versionDivs[index];
                console.log('versionDiv:', versionDiv); // Debugging statement
                if (versionDiv) {
                    versionDiv.querySelector('.appVersion').value = version.version || '';
                    versionDiv.querySelector('.appDownloadURL').value = version.downloadURL || '';
                    versionDiv.querySelector('.appSize').value = version.size || '';
                }
            });
        }
    });
}

function showAndHideCopiedText() {
    copiedText.style.visibility = "visible"; // Make the element visible
  
    // Hide the element after 1000 milliseconds (1 second)
    setTimeout(function () {
      copiedText.style.visibility = "hidden";
    }, 1000);
  }
