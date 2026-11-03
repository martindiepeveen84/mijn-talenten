/* Maakt de live-functie beschikbaar voor de gewone scripts van de gesprekpagina. */
import * as L from "./live.js";
window.LIVE=L;
window.dispatchEvent(new Event("live-klaar"));
