

function updateSalaryValue() {
    document.getElementById("salary-value").innerHTML = document.getElementById("salary").value;
    filterOffer();
}

function updateRegionValue() {
    filterOffer();
}


function filterOffer() {
    let salary = document.getElementById("salary").value;
    let region = document.getElementById("region").value;
    //do not add region if == "all"
    if (region === "all") {
        region = ""
    } else {
        region = "&region=" + region;
    }
    let filter = "salary=" + salary + region;
    //Get all the offers from the /api/offers route and adding the filter parameters
    fetch("/api/offers?" + filter).then(r => r.json()).then(offers => {
            let offersDiv = document.getElementById("offers");
            if (offers.length === 0) {
                offersDiv.innerHTML = "Aucune offre ne correspond à vos critères";
                return;
            }
            offersDiv.innerHTML = "";
            offersDiv.append(...generateOffers(offers));
        }
    );
}


function generateOfferPrototype(offer) {
    const div = document.createElement('div');
    div.className = 'border-1 border p-2 my-2';

    const h4 = document.createElement('h4');
    h4.className = '';
    h4.innerHTML = `${offer.ficheDePoste.typeMetier} <span class="badge text-bg-secondary float-end">${offer.ficheDePoste.salaire} €</span>`;

    const p1 = document.createElement('p');
    p1.innerHTML = offer.ficheDePoste.description;

    const p2 = document.createElement('p');
    p2.innerHTML = `Organisation: ${offer.ficheDePoste.siren}`;

    const a = document.createElement('a');
    a.href = `/canditature/${offer.numero}`;
    a.className = 'btn btn-primary';
    a.innerHTML = 'Postuler';

    div.appendChild(h4);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(a);

    return div;
}

function generateOffers(offers) {
    return offers.map(offer => {
        return generateOfferPrototype(offer);
    });
}
