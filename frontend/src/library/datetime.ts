import { format } from 'date-fns';

export function getTaleDate(value: number, era: String) {
  var temp = getMinDate();
  temp.setDate(temp.getDate() + value);
  var formatted = format(temp, 'yyyy MMMM d');
  return `${era} ${formatted}`;
}

export function getTaleDateShort(value: number) {
  var temp = getMinDate();
  temp.setDate(temp.getDate() + value);
  var formatted = format(temp, 'yyyy.MM');
  return formatted;
}

export function getTaleDateMedium(value: number, era: String) {
  var temp = getMinDate();
  temp.setDate(temp.getDate() + value);
  var formatted = format(temp, 'yyyy MMMM');
  return `${era} ${formatted}`;
}

export function getTaleYear(value: number) {
  var temp = getMinDate();
  temp.setDate(temp.getDate() + value);
  return temp.getFullYear();
}

function getMinDate() {
  return new Date('0001-01-01T00:00:00Z');
}
