import { DateTime } from "luxon";
/**
 * Returns Toronto-local date in ISO format: "YYYY-MM-DD"
 */
export function getTorontoDate() {
  return DateTime.now().setZone("America/Toronto").toISODate(); // e.g. "2025-09-08"
}

/**
 * Returns Toronto-local time in ISO format: "HH:mm:ss"
 */
export function getTorontoTime() {
  return DateTime.now().setZone("America/Toronto").toFormat("HH:mm:ss"); // e.g. "22:07:00"
}

/**
 * Returns Toronto-local datetime in ISO format: "YYYY-MM-DDTHH:mm:ss"
 */
export function getTorontoDateTime() {
  return DateTime.now().setZone("America/Toronto").toFormat("yyyy-MM-dd'T'HH:mm:ss");
}
