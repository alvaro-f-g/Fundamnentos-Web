import { Player, defaultPlayers, defaultSubelements } from "./defaultPlayers.js";

let players = new Map();
let nextId = 0;
let freesIdArray = [];
let freesIdSet = new Set();

function loadDefaultSubelements(id) {
    let sub = [];

    for (let i = 0; i < defaultSubelements.emblems.length; i++) {
        let subelement = {
            emblem: defaultSubelements.emblems[i],
            club: defaultSubelements.clubs[i],
            stage: defaultSubelements.stages[i]
        };
        sub[i] = subelement;
    }

    players.get(id).subelements = sub;
}

export function addPlayer(player) {
    player.id = freesIdArray.length ? freesIdArray.pop() : nextId++;  // Si hay ids que han quedado libres se usará uno de ellos, sino se creará uno nuevo
    players.set(player.id, player);
}

export function deletePlayer(id) {
    if (id >= nextId || freesIdSet.has(id)) throw new Error("Invalid id");

    players.delete(id);

    freesIdArray.push(id);
    freesIdSet.add(id);
}

export function getPlayers() {
    return [...players.values()]; // == Array.from(players.values())
}

export function getPlayer(id) {
    return players.get(id);
}

export function loadDefaultPlayers() {
    defaultPlayers.forEach((player) => {
        addPlayer(player);
        loadDefaultSubelements(player.id);  // Todos tendrán los mismos subelementos
    });
}