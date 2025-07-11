import { createCard } from './card.js';
createCard(JSON.parse(localStorage.getItem("favorite")) || []);