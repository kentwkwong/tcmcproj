export const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString();
};

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export function getTorontoDate(): string {
  const date = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return date.replace(/\//g, "-"); // "YYYY-MM-DD"
}

export function getTorontoTime(): string {
  return new Date().toLocaleTimeString("en-CA", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function getTorontoDateTime(): string {
  return `${getTorontoDate()}T${getTorontoTime()}`;
}
