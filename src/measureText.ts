export type TextMeasurement = {
  width: number,
  fontHeight: number,
  // position of text's alphabetic baseline assuming top is the origin
  baseline: number,
  fontDescent: number,
  actualDescent: number,
};

export function measureText(text: string, font: string): TextMeasurement {
  measureText.context.textBaseline = 'alphabetic';
  // font = "bold 12pt arial";
  measureText.context.font = font;
  // if (text === "hSpace(50)") {
  //   measureText.context.fillText(text, 100, 100);
  //   console.log("measured", font);
  // }
  const measurements = measureText.context.measureText(text);
  return {
    width: Math.abs(measurements.actualBoundingBoxLeft) + Math.abs(measurements.actualBoundingBoxRight),
    fontHeight: Math.abs(measurements.fontBoundingBoxAscent) + Math.abs(measurements.fontBoundingBoxDescent),
    baseline: Math.abs(measurements.fontBoundingBoxAscent),
    fontDescent: Math.abs(measurements.fontBoundingBoxDescent),
    actualDescent: Math.abs(measurements.actualBoundingBoxDescent),
  };
}
// static variable
export namespace measureText {
  export const element = document.createElement('canvas');
  element.width = 1000;
  element.height = 1000;
  document.body.appendChild(element);
  export const context = element.getContext("2d")!;
}
