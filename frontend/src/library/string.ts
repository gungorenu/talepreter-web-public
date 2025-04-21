export function trimAny(str: string, chars: Array<string>) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0) ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0) --end;

  return start > 0 || end < str.length ? str.substring(start, end) : str;
}

// ---- FormattedText Stuff ----

const Tags = ['', '`', '*', '**', '==', '~~', '_', '^', '~', '|'];

export function formatText(line: string): string {
  if (line == null || line == '') return ''; // no formatting
  var temp = line.replaceAll('<u>', '_');
  temp = temp.replaceAll('</u>', '_');
  if (temp === null || temp == '') return ''; // no formatting

  return findInlines(temp);
}

function findInlines(line: string): string {
  var format = 0;
  var result = '';
  for (let i = 0; i < line.length; ) {
    var c = line[i];
    switch (c) {
      case '^':
        format = 7;
        break;
      case '*':
        format = 2;
        if (i < line.length - 1 && line[i + 1] == '*') {
          i++;
          format = 3;
        }
        break;
      case '~':
        format = 8;
        if (i < line.length - 1 && line[i + 1] == '~') {
          format = 5;
          i++;
        }
        break;
      case '=':
        if (i < line.length - 1 && line[i + 1] == '=') {
          i++;
          format = 4;
        } else {
          i++;
          result += c;
          continue;
        }
        break;
      case '_':
        format = 6;
        break;
      case '|':
        format = 9;
        break;
      case '`':
        format = 1;
        break;
      default:
        i++;
        result += c;
        continue;
    }
    i++;

    var tagLength = Tags[format].length;
    var end = line.indexOf(Tags[format], i);
    if (end < 0) return 'ERROR: tag did not end';

    var subsection = line.substring(i, end);
    if (subsection == '' || subsection.length == 0) return 'ERROR: tagged text seems to be empty';
    i += subsection.length + tagLength;

    result += `<span class="CF${format}">` + findInlines(subsection) + `</span>`;
  }

  return result;
}

export function formatNumber(value: number, negativeBad: boolean = true): string {
  if (value == 0) return `**${value}**`;
  if (value < 0) {
    if (negativeBad) return `~${value}~`;
    else return `^${value}^`;
  } else {
    if (negativeBad) return `^+${value}^`;
    else return `~+${value}~`;
  }
}

export function numberString(value: number) {
  if (value <= 0) return `${value}`;
  else return `+${value}`;
}
