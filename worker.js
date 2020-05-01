const CLAMP_PROPERTIES = ['rotationceiling', 'rotationfloor'];

onmessage = function (e) {
  console.log('Worker: message received');
  const text = e.data;

  const adjustedText = text
    .split('\n')
    .map((line) => {
      if (isLineToClamp(line)) {
        return clampLineValue(line);
      }
      return line;
    })
    .join('\n');

  postMessage(adjustedText);
};

function isLineToClamp(line) {
  for (let property of CLAMP_PROPERTIES) {
    if (line.startsWith(property)) {
      return true;
    }
  }

  return false;
}

function clampLineValue(line) {
  let [property, value] = line.replace(/ |;/gi, '').split('=');
  let clampedValue = parseInt(value, 10);

  let formattedLine = `${property} = ${clampedValue}.000;`;
  // console.log(`clamped line ${line} => ${formattedLine}`);

  return formattedLine;
}
