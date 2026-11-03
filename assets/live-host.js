/* Maakt de live-functie beschikbaar voor de gewone scripts van de gesprekpagina. */
import * as L from "./live.js?v=202611032346";
window.LIVE=L;
window.dispatchEvent(new Event("live-klaar"));
