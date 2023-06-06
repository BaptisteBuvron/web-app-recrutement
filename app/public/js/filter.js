//When the page is loaded, update the salary value
window.onload = updateSalaryValue;

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
    if (region == "all") {
        region = ""
    } else {
        region = "&region=" + region;
    }
    let filter = "salary=" + salary + region;
    console.log(filter)
    //Get all the offers from the /api/offers route and adding the filter parameters
    fetch("/api/offers?" + filter).then(r => r.json()).then(data => {
        console.log(generateOffers(data));
    });

}


function generateOfferPrototype(offer) {
    const div = document.createElement('div');
    div.className = 'border-1 border p-2 my-2';

    const h4 = document.createElement('h4');
    h4.className = '';
    h4.innerHTML = `${offer.ficheDePoste.typeMetier} <span class="badge text-bg-secondary float-end">45000 €</span>`;

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
        console.log(
            generateOfferPrototype(offer)
        );

    });
}
